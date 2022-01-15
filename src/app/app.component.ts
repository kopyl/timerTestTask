
import { Component, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, Subject, timer, Subscription, interval } from 'rxjs';
import { filter, pairwise, repeat, take } from 'rxjs/operators';

import { doubleClicks } from './types'

import { cached } from './localstorage'






const doubleClicks$ =
(observable$: Observable<MouseEvent>):
doubleClicks => {

    const obs$: doubleClicks = observable$.pipe(
        pairwise(),
        filter(
            v => v[1].timeStamp - v[0].timeStamp <= 300
        ),
        take(1),
        repeat()
    )
    return obs$

}


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {

    private doubleClicks$: Subject<MouseEvent> = new Subject()
    private timer: Subscription = new Subscription()

    private doubleclicked: boolean = false

    @cached() public isPaused: boolean = false
    @cached() public isStarted: boolean = false
    @cached() public secondsPassed: number = 0

    constructor(private notification: MatSnackBar) {}

    notifyWith(message: string): void {
        this.notification
        .open(message, 'Close', {
            duration: 1000,
            panelClass: ['blue-snackbar']
        })
    }

    updateTime(reset=false) {
        this.secondsPassed++
        reset ? this.secondsPassed = 0 : null
    }

    subscribeOnDoubleClicks(): void {
        doubleClicks$(this.doubleClicks$)
        .subscribe( _ => { this.pauseOrResume() } )
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

    pauseOrResume(): void {

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
        this.doubleClicks$.next(event)
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

        if (this.isStarted && !this.isPaused) {
            this.startCounting()
        }
    }

}
