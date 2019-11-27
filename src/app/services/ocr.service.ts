import { Injectable } from '@angular/core';
import * as Tesseract from 'tesseract.js';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class OcrService {

  tesseract: any;

  constructor(private platform: Platform) { }

  recognize(image) {
    const path = "http://localhost/assets/lib/";
    this.tesseract = Tesseract.create({
      langPath: path + 'tesseract.js-',
      corePath: path + 'tesseract.js-core_0.1.0.js',
      workerPath: path + 'tesseract.js-worker_1.0.10.js',
    });

    this.tesseract.recognize(image).progress(v => {
      console.log("recognizing..");
    }).catch(err => console.error(err))
      .then(result => {
        console.log(result.text);
      })
      .finally(resultOrError => {
        console.log(resultOrError);
      });
  }
}
