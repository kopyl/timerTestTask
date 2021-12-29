
import { Component, AfterViewInit } from '@angular/core';

import { Observable, Subject, timer, Subscription, interval } from 'rxjs';
import { filter, pairwise, repeat, take } from 'rxjs/operators';

import {MatSnackBar} from '@angular/material/snack-bar';

import {utc} from 'moment/moment';


const doubleClicks =
(observable: Observable<MouseEvent>):
Observable<MouseEvent[]> => {

    const obs = observable.pipe(
        pairwise(),
        filter(
            (v: Array<MouseEvent>) =>
            v[1].timeStamp - v[0].timeStamp <= 300
        ),
        take(1),
        repeat()
    )
    return obs

}


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent  implements AfterViewInit {

    private subject: Subject<MouseEvent> = new Subject()
    private observable: Observable<MouseEvent> = this.subject.asObservable()

    private timer: Subscription

    doubleclicked: boolean = false
    clicks: number = 0
    secondsPassed: number = 0
    isPaused: boolean = false
    isStarted: boolean = false
    // humanizedTime: string = "00:00:00"

    get timerRestartLabel() {
        if (!this.isStarted || this.isPaused) return "Start timer"
        if (this.isStarted) return "Stop timer"
        return "Start timer"
    }

    get humanizedTime() {
        let formattedTime: any = utc(this.secondsPassed*1000)
        formattedTime = formattedTime.format('HH:mm:ss')
        return formattedTime
    }



    constructor(private _snackBar: MatSnackBar) {}

    pause() {
        this.doubleclicked = true
        this.clicks++
        if (!this.isPaused) {
        this.timer.unsubscribe()
        this.isPaused = true
        this.notifyWith('Paused')
        } else {
            this.notifyWith('Resumed')
            this.isPaused = false
            this.timer.unsubscribe()
            this.startTimer()
        }
    }

    notifyWith(message: string) {
        this._snackBar.open(message, 'Close', {
            duration: 1000
          });
    }

    detectDoubleClicks() {
        doubleClicks(this.observable)
        .subscribe(
            (e: MouseEvent[]) =>
            { this.pause() }
        )
    }

    ngAfterViewInit(): void {
        this.detectDoubleClicks()

        // console.log(format(50000000, 'hh:mm:ss'));

    }

    notifyToDoubleClick() {
        timer(300).subscribe(
            (e: any) => {
                if (this.doubleclicked) return
                this.notifyWith(
                    `Double click to
                    ${this.isPaused ? 'resume': 'pause'}`
                )
            }
        )
    }

    pauseButtonClick(event: MouseEvent) {
        this.doubleclicked = false
        this.notifyToDoubleClick()
        this.subject.next(event)
    }

    startTimer() {
        this.timer = interval(1000).subscribe(
            e => {this.secondsPassed++}
        )
    }

    restartTimer() {
        this.isPaused = false
        this.secondsPassed = 0
        this.clicks = 0
        this.timer.unsubscribe()
        this.startTimer()
        this.notifyWith('Restarted')
    }

    startOrStopTimer() {

        if (this.isPaused) {
            this.secondsPassed = 0
            this.timer.unsubscribe()
            this.startTimer()
            this.clicks = 0
            this.isPaused = false
            this.notifyWith('Restarted')
            return
        }

        if (this.isStarted) {
            this.isStarted = false
            this.secondsPassed = 0
            this.timer.unsubscribe()
            this.notifyWith('Stopped')
            return
        }
        this.startTimer()
        this.notifyWith('Started')

        this.isStarted = !this.isStarted
    }

}
