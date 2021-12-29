
import { Component, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, Subject, timer, Subscription, interval } from 'rxjs';
import { filter, pairwise, repeat, take } from 'rxjs/operators';


type Tuple<A, B=A> = [A, B]


const doubleClicks =
(observable: Observable<MouseEvent>):
Observable<Tuple<MouseEvent>> => {

    const obs: Observable<Tuple<MouseEvent>> = observable.pipe(
        pairwise(),
        filter(
            v => v[1].timeStamp - v[0].timeStamp <= 300
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

    private doubleclicked: boolean = false
    public isPaused: boolean = false
    public isStarted: boolean = false
    private secondsPassed: number = 0
    public timerRestartLabel: string = "Start timer"
    public formattedTime: string = "00:00:00"

    constructor(private notification: MatSnackBar) {}

    notifyWith(message: string): void {
        this.notification
        .open(message, 'Close', {
            duration: 1000
        })
    }

    getFormattedTimeFromSec(): string {
        let hours: number | string = this.secondsPassed / 3600
        let secs: number | string = this.secondsPassed % 60
        let mins: number | string = this.secondsPassed / 60 % 60

        hours = Math.floor(hours)
        mins = Math.floor(mins)

        hours = String(hours).padStart(2, "0")
        mins = String(mins).padStart(2, "0")
        secs = String(secs).padStart(2, "0")

        return `${hours}:${mins}:${secs}`
    }

    updateTime(reset=false) {
        this.secondsPassed++
        reset ? this.secondsPassed = 0 : null
        this.formattedTime = this.getFormattedTimeFromSec()
    }

    subscribeOnDoubleClicks(): void {
        doubleClicks(this.observable)
        .subscribe(
            (e: MouseEvent[]) =>
            { this.pause() }
        )
    }

    notifyToDoubleClick(): void {
        timer(300).subscribe( () => {
            if (this.doubleclicked) return
            this.notifyWith(
                `Double click to
                ${this.isPaused ? 'resume': 'pause'}`
            )
        })
    }

    pause(): void {

        this.doubleclicked = true
        this.timer.unsubscribe()
        if (!this.isPaused) {
            this.isPaused = true
            this.notifyWith('Paused')
        } else {
            this.startCounting()
            this.isPaused = false
            this.notifyWith('Resumed')
        }

    }

    pauseButtonClick(event: MouseEvent): void {
        this.doubleclicked = false
        this.notifyToDoubleClick()
        this.subject.next(event)
    }

    startCounting(): void {
        this.timer = interval(1000).subscribe(
            e => {this.updateTime()}
        )
    }

    restartStopwatch(): void {
        this.isPaused = false
        this.updateTime(true)
        this.timer.unsubscribe()
        this.startCounting()
        this.notifyWith('Restarted')
    }

    stopStopwatch(): void {
        this.isStarted = false
        this.updateTime(true)
        this.timer.unsubscribe()
        this.notifyWith('Stopped')
    }

    startOrStopStopwatch(): void {
        this.startCounting()
        this.notifyWith('Started')
        this.isStarted = !this.isStarted
    }

    handleStopStopwatch(): void {

        if (this.isPaused) {
            this.restartStopwatch()
            return
        }

        if (this.isStarted) {
            this.stopStopwatch()
            return
        }

        this.startOrStopStopwatch()

    }

    ngAfterViewInit(): void {
        this.subscribeOnDoubleClicks()
    }

}
