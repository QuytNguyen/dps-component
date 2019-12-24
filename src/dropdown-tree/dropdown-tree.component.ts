import { Component, ViewEncapsulation, Input, Output, EventEmitter, forwardRef, OnChanges } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';
// import { DropdownTreeService } from './Services/dropdown-tree.service';
import { BehaviorSubject } from 'rxjs';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

interface TreeNode {
	Title: string;
	Children?: TreeNode[];
	RowID: string;
	Level?: string;
	Select?: boolean
}

@Component({
	selector: 'm-dropdown-tree',
	templateUrl: './dropdown-tree.component.html',
	styleUrls: ['./dropdown-tree.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [NgbDropdownConfig,
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DropdownTreeComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => DropdownTreeComponent),
			multi: true
		}
	]
})
export class DropdownTreeComponent implements OnChanges, ControlValueAccessor, Validator {
	@Input() data: BehaviorSubject<any[]>;
	@Input() DropdownTitle: string;
	@Input() FieldTitle: string = "Title";
	@Input() FieldId: string = "RowID";
	@Input() FieldChildren: string = "Children";
	@Input() disabled: boolean = false;
	// @Input() SelectedNode: BehaviorSubject<any>;
	@Output() SelectedItemTree = new EventEmitter();
	focus: boolean = false;
	valid: boolean = false;
	treeControl = new NestedTreeControl<any>(node => node[this.FieldChildren]);
	dataSource;
	Title: string = "";
	Placement: string = "bottom-left";
	selectedNode: any;
	dropdowntreeControl = new FormControl();
	isValid: boolean = false;
	constructor() { }
	ngOnChanges() {
		this.selectedNode = {};
		this.selectedNode[this.FieldTitle] = "";
		this.selectedNode[this.FieldId] = "";
		this.isValid = false;
		this.dataSource = new ArrayDataSource(this.data);
		//trường hợp không khớp field
		this.data.subscribe(data => {
			if (data && data[0] && (data[0][this.FieldId] == undefined || data[0][this.FieldTitle] == undefined)) {
				this.dataSource = new ArrayDataSource([]);
			}
		});
		this.data.subscribe(ev => {
			this.treeControl.dataNodes = ev;
			this.treeControl.expandAll();
		});
	};
	hasChild = (_: number, node: any) => !!node[this.FieldChildren] && node[this.FieldChildren].length > 0;

	SelectItemTree(node: any) {
		this.SelectedItemTree.emit(node);
		this.selectedNode = node;
		if (this.selectedNode && this.selectedNode[this.FieldTitle]) {
			this.isValid = true;
		}
		else {
			this.isValid = false;
		}
		this.dropdowntreeControl.setValue(this.selectedNode[this.FieldTitle]);
		this.onChangeCallback(this.selectedNode[this.FieldId]);
	}

	getTitle(data, ID) {
		data.forEach(element => {
			if (element[this.FieldId] == ID) {
				this.selectedNode[this.FieldTitle] = element[this.FieldTitle];
				return;
			}
			if (element[this.FieldChildren] && element[this.FieldChildren].length) {
				this.getTitle(element[this.FieldChildren], ID);
			}
		});
	}
	focusFunction() {
		if (!this.disabled) {
			this.focus = true;
			this.valid = true;
		}
		else {
			return;
		}
	}
	focusOutFunction() {
		if (!this.disabled) {
			if (!this.selectedNode[this.FieldId]) {
				this.valid = false;
			}
			//   else{
			//     this.dropdowntreeControl.markAsUntouched();
			// }
			this.focus = false;
		}
		else {
			return;
		}

	}

	ClearData(event) {
		if(event)
			event.stopPropagation();
		this.selectedNode[this.FieldTitle] = "";
		this.selectedNode[this.FieldId] = "";
		this.isValid = false;
		this.SelectedItemTree.emit(this.selectedNode);
		this.dropdowntreeControl.setValue(this.selectedNode[this.FieldTitle]);
		this.onChangeCallback(this.selectedNode[this.FieldId]);
	}
	writeValue(obj: any) {
		if (obj === null) {
			this.ClearData(null);
		}
		else {
			if (obj) {
				this.selectedNode[this.FieldId] = obj;
				this.getTitle(this.treeControl.dataNodes, this.selectedNode[this.FieldId]);
				if (this.selectedNode && this.selectedNode[this.FieldTitle]) {
					this.isValid = true;
				}
				else {
					this.isValid = false;
				}
				//this.onChangeCallback(this.selectedNode[this.FieldId]);
			}
		}
	}
	onChangeCallback = (value: string) => {
	};
	onTouchCallback = () => { };

	registerOnChange(fn: any): void {
		this.onChangeCallback = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouchCallback = fn;
	}
	// validates the form, returns null when valid else the validation object
	validate(control: FormControl) {
		if (control.hasError('required')) {
			if (!this.isValid && !this.disabled) {
				this.dropdowntreeControl = new FormControl('', Validators.required);
				// this.dropdowntreeControl.markAsTouched();
			}
			return this.isValid ? null : {
				invalid: false
			};
			// this.dropdowntreeControl.markAsUntouched();
		}

		return null;
	}
}
