// Merchant volume data used by the concept MerchantVolumePanel.
// Swap with real API data when wiring the backend.

export interface MerchantVolumeRow {
  rank: number
  merchant: string
  volume: number
  txnCount: number
  avgTicket: number
}

export const MERCHANT_VOLUME_DATA: MerchantVolumeRow[] = [
  { rank: 1,  merchant: "Harbor View Hotel",     volume: 3241880, txnCount: 14312, avgTicket: 226.50  },
  { rank: 2,  merchant: "Summit Auto Group",      volume: 2918440, txnCount:  1047, avgTicket: 2787.00 },
  { rank: 3,  merchant: "Coastal Fresh Market",   volume: 2104320, txnCount: 41208, avgTicket:   51.06 },
  { rank: 4,  merchant: "Pinnacle Dental Group",  volume: 1876200, txnCount:  3881, avgTicket:  483.40 },
  { rank: 5,  merchant: "Pacific Rim Restaurant", volume: 1203440, txnCount: 19872, avgTicket:   60.56 },
  { rank: 6,  merchant: "Riviera Day Spa Chain",  volume: 1188100, txnCount: 10341, avgTicket:  114.90 },
  { rank: 7,  merchant: "Blue Oak Brewing Co.",   volume: 1044780, txnCount: 22104, avgTicket:   47.26 },
  { rank: 8,  merchant: "Greenfield Hardware",    volume:  887330, txnCount:  9812, avgTicket:   90.43 },
  { rank: 9,  merchant: "Westside CrossFit",      volume:  701240, txnCount:  5440, avgTicket:  128.90 },
  { rank: 10, merchant: "Canyon Road Bakery",     volume:  618770, txnCount: 24908, avgTicket:   24.84 },
]
