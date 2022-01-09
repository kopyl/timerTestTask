import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { HhmmssPipe } from './hhmmssPipe/hhmmss.pipe'

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                HhmmssPipe
            ],
            imports: [
                MatSnackBarModule
            ]
        }).compileComponents();

        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        app.ngAfterViewInit()
        app.startCounting()
        expect(app).toBeTruthy();
    });

    // it('should update time on reset', () => {
    //     const fixture = TestBed.createComponent(AppComponent);
    //     const app = fixture.componentInstance;
    //     app.handleStopStopwatch()
    // })

//     it(`should have as title 'testDec242021'`, () => {
//         const fixture = TestBed.createComponent(AppComponent);
//         const app = fixture.componentInstance;
//         // expect(app.title).toEqual('testDec242021');
//     });

//     it('should render title', () => {
//         const fixture = TestBed.createComponent(AppComponent);
//         fixture.detectChanges();
//         const compiled = fixture.nativeElement as HTMLElement;
//         // expect(compiled.querySelector('.content span')?.textContent).toContain('testDec242021 app is running!');
//     });
});
