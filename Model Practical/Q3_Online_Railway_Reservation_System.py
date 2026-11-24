"""
CSA10 Software Engineering - Model Practical (Set 10)
Q3: Online Railway Reservation System - Object-Oriented Implementation & Seat Locking Verification
Author: M. Keerthan (1925260006)
"""
from dataclasses import dataclass, field
from typing import Dict, List, Optional

@dataclass
class Seat:
    seatNo: str
    coachNo: str
    berthType: str  # LB, MB, UB, SL, SU
    isAvailable: bool = True

    def lockSeat(self) -> bool:
        if not self.isAvailable:
            return False
        self.isAvailable = False
        return True

    def releaseSeat(self) -> None:
        self.isAvailable = True

@dataclass
class TrainSchedule:
    scheduleId: str
    trainNo: int
    trainName: str
    sourceStation: str
    destStation: str
    journeyDate: str
    seats: Dict[str, Seat] = field(default_factory=dict)

    def checkAvailability(self) -> List[Seat]:
        return [s for s in self.seats.values() if s.isAvailable]

    def allocateSeat(self, seatNo: str) -> Seat:
        seat = self.seats.get(seatNo)
        if not seat or not seat.lockSeat():
            raise ValueError(f"SeatLockException: Seat {seatNo} on Train {self.trainNo} ({self.journeyDate}) is already BOOKED!")
        return seat

@dataclass
class PaymentGateway:
    paymentId: str
    amount: float
    paymentMode: str
    status: str = "PENDING"

    def processPayment(self) -> bool:
        self.status = "SUCCESS"
        return True

    def processRefund(self, deduction_pct: float = 0.20) -> float:
        self.status = "REFUNDED"
        return round(self.amount * (1.0 - deduction_pct), 2)

@dataclass
class TicketBooking:
    pnrNumber: str
    passengerName: str
    schedule: TrainSchedule
    allocatedSeat: Seat
    payment: PaymentGateway
    bookingStatus: str = "CONFIRMED"

    def sendETicket(self) -> str:
        return (f"[E-TICKET] PNR: {self.pnrNumber} | Passenger: {self.passengerName} | "
                f"Train: {self.schedule.trainNo} ({self.schedule.trainName}) | "
                f"Date: {self.schedule.journeyDate} | Coach/Seat: {self.allocatedSeat.coachNo}-{self.allocatedSeat.seatNo} "
                f"({self.allocatedSeat.berthType}) | Status: {self.bookingStatus}")

    def cancelTicket(self) -> str:
        self.bookingStatus = "CANCELLED"
        self.allocatedSeat.releaseSeat()
        refund = self.payment.processRefund(deduction_pct=0.20)
        return f"[CANCELLATION] PNR {self.pnrNumber} cancelled. Seat {self.allocatedSeat.seatNo} released. Refund issued: Rs.{refund}"

if __name__ == "__main__":
    sched = TrainSchedule("SCH-2026-1124", 12627, "Karnataka Express", "MAS", "NDLS", "2026-11-25")
    sched.seats["S4-18"] = Seat("18", "S4", "LB")
    sched.seats["S4-19"] = Seat("19", "S4", "UB")

    print("1. Available seats before booking:", [f"{s.coachNo}-{s.seatNo}" for s in sched.checkAvailability()])
    seat = sched.allocateSeat("S4-18")
    pay = PaymentGateway("PAY-9081", 1450.0, "UPI")
    pay.processPayment()
    booking = TicketBooking("PNR8842109", "M. Keerthan", sched, seat, pay)
    print("2.", booking.sendETicket())

    try:
        print("3. Attempting duplicate booking on same Train + Date + Seat (S4-18)...")
        sched.allocateSeat("S4-18")
    except ValueError as err:
        print("   -> Blocked Duplicate Booking:", err)

    print("4.", booking.cancelTicket())
