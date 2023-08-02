import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-picture-stream',
  templateUrl: './picture-stream.component.html',
  styleUrls: ['./picture-stream.component.scss']
})
export class PictureStreamComponent {

  imageBlob: Blob | null = null;
  imageNotFound: boolean = false;
  isImageLoaded: boolean = false;
  isLoading: boolean = false;
  testNumber!: number;

  imgWidth: number = 1200;
  imgHeight: number = 650;

  constructor(private zone: NgZone) {}

  loadImg() {
    this.imageBlob = null;
    this.imageNotFound = false;
    this.isLoading = true;
    const imageElement: HTMLImageElement = document.getElementById("image") as HTMLImageElement;
    const eventSource = new EventSource(
                        `https://devfirmware.maks.systems:8443/api/v1/pictures/download/stream/sse/test?testNumber=${this.testNumber}`
                        );

    eventSource.onmessage = (event) => {
      const packetData = JSON.parse(event.data);
      const base64Data = packetData.frameData;

      if (!packetData.frameOffset) {
        this.imageBlob = this.base64ToBlob(base64Data);
      } else {
        this.imageBlob = this.mergeBlobs(this.imageBlob as Blob, this.base64ToBlob(base64Data));
      }

      const blobURL = URL.createObjectURL(this.imageBlob);
      imageElement.src = blobURL;
    };

    eventSource.onerror = (error) => {
      this.zone.runTask(()=> {
        this.isLoading = false;
      })
      if(!this.imageBlob) {
        this.zone.runTask(() => {
          this.imageNotFound = true;
          imageElement.src = '';
        })
      } else {
        this.zone.runTask(() => {
          eventSource.close();
          this.isImageLoaded = true;
          this.imageBlob = null;
        });
      }
      return;
    }
  }

  base64ToBlob(base64Data: string): Blob {
    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    const mimeString = "image/jpeg";
    return new Blob([intArray], { type: mimeString });
  }

  mergeBlobs(blob1: Blob, blob2: Blob): Blob {
    const mergedBlobParts = [blob1, blob2];
    return new Blob(mergedBlobParts, { type: blob1.type });
  }

}


