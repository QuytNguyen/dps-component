import { Component, OnInit, ChangeDetectorRef, Input, ViewEncapsulation, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, NG_VALIDATORS, Validators } from '@angular/forms';
function readBase64(file): Promise<any> {
    var reader = new FileReader();
    var future = new Promise((resolve, reject) => {
        reader.addEventListener("load", function () {
            resolve(reader.result);
        }, false);

        reader.addEventListener("error", function (event) {
            reject(event);
        }, false);

        reader.readAsDataURL(file);
    });
    return future;
}
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
    selector: 'dl-image-control',
    templateUrl: './image-control.component.html',
    styleUrls: ['./image-control.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ImageControlComponent),
        multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ImageControlComponent),
      multi: true
    }
    ]
})
export class ImageControlComponent implements OnInit, ControlValueAccessor, Validator {
    files: any;
    ImageControl = new FormControl();
    @Input() data: any;
    @Input() type: string = "";//filter image or file
    @Input() multiple: boolean = false;//truyền ít
    @Input() required: boolean=false;//bắt buộc
    @Input() nameButton: string = "Choose File";
    @Input() disabled:boolean=false;
    @ViewChild('fileUpload', {static: true}) fileUpload: ElementRef;
    real_files: any;
    IsValid = false;
    public uploader: FileUploader = new FileUploader({ url: URL });

    constructor(
        private changeDetectorRefs: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        //this.type="image/*";//only image
        // this.type = "";//get all
        this.files = [];
        if (this.data.Files && this.data.Files.length > 0) {
            if(this.multiple==false){
                let file=[];
                file.push(this.data.Files[0]);
                this.files = file;
            }
            else {
                this.files = Object.assign(this.data.Files);
            }
            this.IsValid = true;
        } else {
            this.IsValid = false;
        }
        this.real_files = this.files;
    }

    triggerClick() {
        let ele = this.fileUpload.nativeElement;
        ele.click();
    }
    checkDuplicated(_item, file) {
        for (var i = 0; i < _item.length; i++) {
            let element = _item[i];
            if (element.filename === file.filename && element.strBase64 === file.strBase64) {
                alert(element.filename + " already exist");
                return false;
            }
        };
        return true;
    }
    public onFileSelected(event: any) {
        debugger
        let _ref = this.changeDetectorRefs;
        let _this = this;
        let _item = this.files;
        console.log("_item", _item);
        try {
            if (this.multiple) {
                for (var i = 0; i < event.length; i++) {
                    const file: File = event[i];
                    readBase64(file)
                        .then(function (data) {
                            let _fl = {
                                // strBase64: data,
                                strBase64:data.split(',')[1],
                                filename: file.name,
                                extension: file.name.split('.').pop(),
                                Type: file.type && file.type.includes('image') ? 1 : 2,
                                type: file.type,
                                IsAdd: true
                            };
                            if (_this.checkDuplicated(_item, _fl)) {
                                _item.push(_fl);
                                _this.IsValid = _this.checkValueControl(_item);
                                _ref.detectChanges();
                                _this.onChangeCallback(_item);
                            }
                        });
                }
            } else {
                _item =[];
                if(this.data.Files[0]){
                    let old_item=Object.assign(this.data.Files[0]);
                    if(old_item){
                        old_item.IsDel=true;
                        _item.push(old_item);
                    }
                }
                const file: File = event[0];
                readBase64(file)
                    .then(function (data) {
                        _item.push({
                            // strBase64: data,
                            strBase64:data.split(',')[1],
                            filename: file.name,
                            extension: file.name.split('.').pop(),
                            Type: file.type && file.type.includes('image') ? 1 : 2,
                            type: file.type,
                            IsAdd: true
                        });
                        _this.IsValid = _this.checkValueControl(_item);
                        _this.files=_item;
                        console.log("files", _this.files);
                        _ref.detectChanges();
                        _this.onChangeCallback(_item);
                    });
            }
        }
        catch(ex){
            console.log("Lỗi:",ex);
            this.IsValid = false;
        }
    }
    writeValue(obj: any) {
        if (obj === null) {
            this.files = [];
            this.IsValid = this.checkValueControl(this.files);
            this.ImageControl.setValue(this.real_files);
            this.onChangeCallback(this.files);
        }
        else{
            if(obj){
                this.files=obj;
            }
        }
    }
    onChangeCallback = (value: any) => {
    };
    onTouchCallback = () => { };

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchCallback = fn;
    }
    // validates the form, returns null when valid else the validation object
    validate(control:FormControl) {
        if (this.required&&!this.IsValid) {
            return {
                valid: false
            };
        }
        return null;
    }
    checkValueControl(_files) {
        let real_arr = [];
        for (var i = 0; i < _files.length; i++) {
            let item = _files[i];
            if (!item.IsDel) {
                real_arr.push(item);
            }
        }
        this.real_files = real_arr;
        console.log("item", this.real_files);
        if (real_arr.length > 0) {
            return true;
        }
        else {
            return false;
        }

    }
    DeleteImg(event, idx) {
        if (!this.files[idx].IsAdd) {
            this.files[idx].IsDel = true;
        }
        else {
            this.files.splice(idx, 1);
            this.changeDetectorRefs.detectChanges();
        }
        this.IsValid = this.checkValueControl(this.files);
        this.onChangeCallback(this.files);
    }
}
