export function date(pastDate: Date = new Date()):string {


    const addZero = function(x: string | number, n: number) {
        while (x.toString().length < n) {
            x = "0" + x;
        }
        return x;
    }

    let d
    if(pastDate){
        d = pastDate;
    } else {
        d = new Date();
    }
    const date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    const h = addZero(d.getHours(), 2);
    const m = addZero(d.getMinutes(), 2);
    const s = addZero(d.getSeconds(), 2);
    const fullDate = date + ' ' + h + ":" + m + ":" + s;

    return fullDate;
}   