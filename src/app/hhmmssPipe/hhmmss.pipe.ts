import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'hhmmss'
})
export class HhmmssPipe implements PipeTransform {

    transform(value: number): string {
        let hours: number | string = value / 3600
        hours = Math.floor(hours)
        hours = String(hours).padStart(2, "0")

        const minAndSec: string = new Date(value * 1000)
        .toISOString().substring(14, 19)

        return `${hours}:${minAndSec}`

    }

}
