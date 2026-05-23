/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  sender: "user" | "nakshatra";
  text: string;
  timestamp: Date;
  isJson?: boolean;
  bookingData?: BookingDetails;
}

export interface BookingDetails {
  booking_id: string;
  status: "pending_payment" | "confirmed";
  client_name: string;
  astrologer_name: string;
  astrologer_specialization: string;
  consultation_type: string;
  scheduled_at: string;
  duration_minutes: number;
  total_fee_inr: number;
  advance_amount_inr: number;
  advance_percentage: number;
  payment_deadline: string;
  payment_methods: string[];
  upi_id: string;
  refund_policy: {
    "24hr_before": string;
    "12hr_before": string;
    "2hr_before": string;
  };
  confirmation_message: string;
}

export interface KundliInputs {
  name: string;
  dob: string;
  tob: string;
  pob: string;
}

export interface CompatibilityInputs {
  partner1Name: string;
  partner1Dob: string;
  partner1Tob: string;
  partner1Pob: string;
  partner2Name: string;
  partner2Dob: string;
  partner2Tob: string;
  partner2Pob: string;
}

export interface Gemstone {
  name: string;
  image: string;
  sanskritName: string;
  planet: string;
  metal: string;
  finger: string;
  mantra: string;
  benefits: string[];
  precautions: string;
}

export interface VastuTip {
  room: string;
  direction: string;
  dosha: string;
  remedy: string;
}
