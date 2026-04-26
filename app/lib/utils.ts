function slotToMinutes(time: { hour: number; minute: number }): number;
function slotToMinutes(date: Date): number;

export function slotToMinutes(
    value: { hour: number; minute: number } | Date,
): number {
    if (value instanceof Date) {
        return value.getHours() * 60 + value.getMinutes();
    }

    return value.hour * 60 + value.minute;
}
