import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ChipsOptionItem } from './chips-multiselect.models';

interface ChipsOptionsItemInternal extends ChipsOptionItem {
    isNew?: boolean;
}

@Component({
    selector: 'app-chips-multiselect',
    templateUrl: './chips-multiselect.component.html',
    styleUrls: ['./chips-multiselect.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsMultiselectComponent implements OnInit {
    @Input() options: ChipsOptionItem[];
    @Input() multiselect: boolean = true;
    @Input() inlineAdd: boolean = true;
    @Input() selectItemOnBlur: boolean = true;

    @ViewChild('inputElement', { static: false }) inputElement: ElementRef<HTMLInputElement>;
    @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

    remainingOptions: ChipsOptionsItemInternal[] = [];
    selectedOptions: ChipsOptionsItemInternal[] = [];
    filteredOptions: Observable<ChipsOptionsItemInternal[]>;

    separatorKeysCodes: number[] = [ENTER, COMMA];
    inputControl = new FormControl();

    private newItemsCounter: number = 0;

    constructor() {
        this.filteredOptions = this.inputControl.valueChanges.pipe(
            startWith(null),
            map((inputValue: string | ChipsOptionsItemInternal | null) => {
                return typeof inputValue === 'string' ? this.filterItemsByName(inputValue) : this.remainingOptions.slice();
            }),
        );
    }

    ngOnInit() {
        this.remainingOptions = this.options.slice();
    }

    add(event: MatChipInputEvent): void {
        // Add option only when MatAutocomplete is not open
        // To make sure this does not conflict with OptionSelected Event
        if (!this.matAutocomplete.isOpen) {
            const input = event.input;
            const inputValue = event.value;

            if ((inputValue || '').trim()) {
                const addedItem = this.getItemByName(inputValue.trim());
                if (!addedItem) {
                    return;
                }

                this.addItemToSelected(addedItem);
            }

            if (input) {
                input.value = '';
            }

            this.inputControl.setValue(null);
        }
    }

    remove(optionToRemove: ChipsOptionsItemInternal): void {
        this.removeItemFromSelected(optionToRemove);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        const addedItem = event.option.value as ChipsOptionsItemInternal;

        this.addItemToSelected(addedItem);

        this.inputElement.nativeElement.value = '';
        this.inputControl.setValue(null);
    }

    private addItemToSelected(optionToAdd: ChipsOptionsItemInternal) {
        if (optionToAdd.isNew) {
            this.newItemsCounter++;
            optionToAdd.id = (-this.newItemsCounter).toString();
        }
        this.selectedOptions.push(optionToAdd);

        if (!optionToAdd.isNew) {
            const itemIndex = this.remainingOptions.findIndex(item => item.id === optionToAdd.id);
            if (itemIndex >= 0) {
                this.remainingOptions.splice(itemIndex, 1);
            }
        }
    }

    private removeItemFromSelected(optionToRemove: ChipsOptionsItemInternal) {
        const index = this.selectedOptions.findIndex(option => option.id === optionToRemove.id);
        if (index === -1) {
            throw new Error("Can't find option to remove in selected options");
        }

        this.selectedOptions.splice(index, 1);

        if (optionToRemove.isNew) {
            this.newItemsCounter--;
        } else {
            this.remainingOptions.push(optionToRemove);
        }
    }

    private getItemByName(name: string) {
        const existingItem = this.remainingOptions.find(option => option.name === name);
        if (existingItem) {
            return existingItem;
        } else if (this.inlineAdd) {
            return {
                id: null,
                isNew: true,
                name: `${name} (new)`,
            };
        }

        return null;
    }

    private filterItemsByName(value: string): ChipsOptionsItemInternal[] {
        const filterValue = value.toLowerCase();
        const filteredValues = this.remainingOptions.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);

        if (this.inlineAdd && !filteredValues.some(filteredValue => filteredValue.name === filterValue)) {
            filteredValues.push({
                id: null,
                isNew: true,
                name: `${value} (new)`,
            });
        }

        return filteredValues;
    }
}
