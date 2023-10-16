export class ManagerTimer {
    private static timer: NodeJS.Timeout|undefined;

    public static startTimer(timerFunc: () => void, timeDelay: number) {
        this.resetTimer();
        this.timer = setTimeout(timerFunc, timeDelay)
    }

    public static resetTimer() {
        if (!this.timer) {
            return;
        }
        clearTimeout(this.timer);
    }
}