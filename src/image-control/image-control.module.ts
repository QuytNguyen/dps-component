// Angular
import { NgModule, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageControlComponent } from './image-control.component';
import { FileUploadModule } from 'ng2-file-upload';
//Component

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		NgbProgressbarModule,
		FileUploadModule
	],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ImageControlComponent),
			multi: true
		}
	],
	entryComponents: [
		ImageControlComponent
	],
	declarations: [
		ImageControlComponent
	],
	exports: [
		ImageControlComponent
	]
})
export class ImageControlModule {
}
