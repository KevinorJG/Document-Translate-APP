import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonButton,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { TranslateService } from '../services/translate.service';

enum MimeType {
  PDF = 'application/pdf',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  TEXT = 'text/plain',
  MSWORD = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonButton,
    CommonModule,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule
  ],
})
export class HomePage {
  @ViewChild('iconContent', { static: false })
  protected iconContent: ElementRef<HTMLImageElement> | null = null;
  protected selectedFile: File | null = null;
  protected mimetypes = [
    MimeType.PDF,
    MimeType.JPEG,
    MimeType.PNG,
    MimeType.TEXT,
    MimeType.MSWORD,
    MimeType.DOCX,
  ];

  protected documentForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private translateService: TranslateService) {

    this.documentForm = this.formBuilder.group({
      file: ['', [Validators.required]],
      language: ['', [Validators.required]],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (!this.isValidDocument(input.files[0])) {
        this.selectedFile = input.files[0];
        console.log('Archivo seleccionado:', this.selectedFile);
        this.iconContent!.nativeElement.src = this.getIcon();
      } else {
        console.error('El archivo seleccionado no es válido.');
      }
    }
  }


  isValidDocument(file: File): boolean {
    return this.mimetypes.includes(
      MimeType[file.type as keyof typeof MimeType]
    );
  }

  getIcon(): string {
    if (this.selectedFile) {
      return this.getIconByMimeType(this.selectedFile.type);
    }
    return '';
  }

  onSubmit(){
    console.log('Formulario enviado:', this.documentForm.value);

    if(this.documentForm.valid){
    this.translateService.translateDocument(this.selectedFile!, this.documentForm.value.language).subscribe({
      next: (response: any) => {
        // this.downLoadFile(response, response.type);
      },
    })
    } else {
      alert('Formulario inválido');
    }
  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert( 'Please disable your Pop-up blocker and try again.');
    }
}

  getIconByMimeType(mimeType: string): string {
    switch (mimeType) {
      case MimeType.PDF:
        return 'assets/icon/pdf.png';
      case MimeType.JPEG:
      case MimeType.PNG:
        return 'assets/icon/image.png';
      case MimeType.TEXT:
        return 'assets/icon/text.png';
      case MimeType.MSWORD:
      case MimeType.DOCX:
        return 'assets/icon/doc.png';
      default:
        return '';
    }
  }
}
