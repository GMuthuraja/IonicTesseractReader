import { Component } from '@angular/core';
import * as Tesseract from 'tesseract.js'
import { Camera, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { OcrService } from '../services/ocr.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  selectedImage: string;
  imageText: string;


  constructor(private camera: Camera, private actionSheetCtrl: ActionSheetController,
    public loadingController: LoadingController, public ocr: OcrService) { }

  async selectSource() {
    let actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Use Library',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: 'Capture Image',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  getPicture(sourceType: PictureSourceType) {
    this.camera.getPicture({
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then((imageData) => {
      this.selectedImage = `data:image/jpeg;base64,${imageData}`;
      this.ocr.recognize(this.selectedImage);
    });
  }

  async recognizeImage() {
    console.log(this.selectedImage);
    const loading = await this.loadingController.create({
      message: 'Please wait..',
    });
    loading.present();

    Tesseract.recognize(this.selectedImage)
      .progress(message => {
        console.log("recognizing..");
      })
      .catch(err => console.error(err))
      .then(result => {
        this.imageText = result.text;
        console.log(result.text);
        loading.dismiss();
      })
      .finally(resultOrError => {
        alert(resultOrError);
        console.log(resultOrError);
        loading.dismiss();
      });
  }

}
