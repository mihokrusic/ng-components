import { Component } from '@angular/core';
import { ChipsOptionItem } from './components/chips-multiselect/chips-multiselect.models';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
    options: ChipsOptionItem[] = [
        { id: '1', name: 'Dog' },
        { id: '2', name: 'Cat' },
        { id: '3', name: 'Lion' },
        { id: '4', name: 'Cougar' },
        { id: '5', name: 'Elephant' },
        { id: '6', name: 'Bird' },
        { id: '7', name: 'Fish' },
        { id: '8', name: 'TestAnimalWithBigNameSoWeCanSeeHowItBehavesInOverflow' },
        { id: '9', name: 'Test Animal With Big Name So We Can See How It Behaves In Overflow' },
    ];

    chipsMultiselect: boolean = true;
    chipsInlineAdd: boolean = true;
    chipsSelectOnBlur: boolean = true;
}
