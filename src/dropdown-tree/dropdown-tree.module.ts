import { NgModule, forwardRef } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DropdownTreeComponent } from './dropdown-tree.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CdkTreeModule } from '@angular/cdk/tree';
import { FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		CdkTreeModule
	],
	providers: [
		// DropdownTreeService
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DropdownTreeComponent),
			multi: true
		  }
	],
	entryComponents: [
		DropdownTreeComponent
	],
	declarations: [
		DropdownTreeComponent
	],
	exports: [
		DropdownTreeComponent
	]
})
export class DropdownTreeModule { }
