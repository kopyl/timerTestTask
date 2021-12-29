
import { Component, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, Subject, timer, Subscription, interval } from 'rxjs';
import { filter, pairwise, repeat, take } from 'rxjs/operators';

import { utc, Moment } from 'moment/moment';


const doubleClicks =
(observable: Observable<MouseEvent>):
Observable<MouseEvent[]> => {

    const obs: Observable<MouseEvent[]> = observable.pipe(
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

    private doubleclicked: boolean = false
    private isPaused: boolean = false
    public isStarted: boolean = false
    public pauseButtonClicks: number = 0
    private secondsPassed: number = 0

    public get timerRestartLabel(): string {
        if (!this.isStarted || this.isPaused) return "Start timer"
        if (this.isStarted) return "Stop timer"
        return "Start timer"
    }

    public get formattedTime(): string {
        let time: Moment | string = utc(this.secondsPassed*1000)
        time = time.format('HH:mm:ss')
        return time
    }

    constructor(private notification: MatSnackBar) {}

    notifyWith(message: string): void {
        this.notification
        .open(message, 'Close', {
            duration: 1000
        })
    }

    detectDoubleClicks(): void {
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
        this.pauseButtonClicks++
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
            e => {this.secondsPassed++}
        )
    }

    restartStopwatch(): void {
        this.isPaused = false
        this.secondsPassed = 0
        this.pauseButtonClicks = 0
        this.timer.unsubscribe()
        this.startCounting()
        this.notifyWith('Restarted')
    }

    stopStopwatch(): void {
        this.isStarted = false
        this.secondsPassed = 0
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
        this.detectDoubleClicks()
    }

}
