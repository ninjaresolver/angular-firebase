import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { enc, AES } from 'crypto-js';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firestore: AngularFirestore) { }

  async userExists(email: string): Promise<any> {
    const userSnapshot = await this.firestore
      .collection('users', (ref) =>
        ref.where('email', '==', email).limit(1)
      )
      .get()
      .toPromise();
  
    const emailSnapshot = await this.firestore
      .collection('users', (ref) => ref.where('email', '==', email).limit(1))
      .get()
      .toPromise();
  
    return (userSnapshot && userSnapshot.size > 0) || (emailSnapshot && emailSnapshot.size > 0);
  }
  

  register(data: any) {
    // Encrypt the password
    const encryptedPassword = AES.encrypt(data.password, 'secretKey').toString();
    // Update the data object with the encrypted password

    return this.userExists(data.email).then(res => {
      if(res) {
        console.log("Email already existed");
        return new Promise((resolve, reject) => {
          resolve({ status: false, message: "Email already exists" });
        })
      } else {
        let req = {
          email: data.email,
          password: encryptedPassword
        }
        return this.firestore.collection('users').add(req)
        .then((docRef) => {
          console.log("Data saved successfully with document ID:", docRef.id);
          return {
            status: true,
            message: "Saved successfully"
          }
        })
        .catch((error) => {
          console.error("Error saving data:", error);
          return {
            status: false,
            message: "Error occured"
          }
        });
      }
    })
  }
  

  async login(email: string, password: string): Promise<any> {
    const userSnapshot = await this.firestore
      .collection('users', (ref) =>
        ref.where('email', '==', email).limit(1)
      )
      .get()
      .toPromise();
  
    if (userSnapshot?.empty) {
      const emailSnapshot = await this.firestore
        .collection('users', (ref) => ref.where('email', '==', email).limit(1))
        .get()
        .toPromise();
  
      if (emailSnapshot?.empty) {
        return {
          status: false,
          message: "Email does not exist"
        }; // User not found
      }
    }
  
    const user: any = userSnapshot?.docs[0]?.data();
  
    if(user) {
      // Decrypt the stored password
      const decryptedPassword = AES.decrypt( user.password, 'secretKey').toString(enc.Utf8);
    
      if (decryptedPassword !== password) {
        return {
          status: false,
          message: "Password is incorrect"
        }; // Password does not match
      }
    
      return {
        status: true,
        message: "Logged in successfully"
      };
    } else {
      return {
        status: false,
        message: "Something went wrong"
      };
    }
  }
  

  
  
  getUsers() {
    return from(this.firestore.collection('users').get())
      .pipe(
        map((querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            const documentData = doc.data();
            data.push(documentData);
          });
          return data;
        })
      )
      .toPromise()
      .catch((error) => {
        console.error("Error getting data:", error);
        return []; // Return an empty array or handle the error case
      });
  }
  

}
