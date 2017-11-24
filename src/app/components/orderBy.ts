import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'reverse'
})

export class ReversePipe {
    transform(value: Array<any>) {

        if (value == null) return;

       var a = value.sort(function (a, b) {
            if (a.date > b.date)
                return -1;
            if (a.date < b.date)
                return 1;
            return 0;
        })
    
        return a;
    
  }
}

