import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFinderStore = create((set, get) => ({
  uploadedItems: [
    {
      id: 1,
      name: "Designer Leather Wallet",
      description: "Found in the student lounge with credit cards and ID.",
      category: "Wallet",
      locationFound: "Student Center Lounge",
      datePosted: "2023-06-15",
      imageUrl:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Approved",
      hasNewClaims: true,
    },
    {
      id: 2,
      name: "Ray-Ban Sunglasses",
      description: "Wayfarer style found near sports bleachers.",
      category: "Accessories",
      locationFound: "Sports Field Bleachers",
      datePosted: "2023-06-14",
      imageUrl:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Pending",
      hasNewClaims: false,
    },
    {
      id: 3,
      name: "Black Backpack",
      description: "North Face backpack with laptop compartment.",
      category: "Bag",
      locationFound: "Bus Stop #12",
      datePosted: "2023-06-10",
      imageUrl:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Rejected",
      hasNewClaims: false,
    },
    {
      id: 4,
      name: "Gold Necklace",
      description: "Thin gold chain with heart pendant.",
      category: "Jewelry",
      locationFound: "Central Campus Fountain",
      datePosted: "2023-06-05",
      imageUrl:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Approved",
      hasNewClaims: true,
    },
    {
      id: 5,
      name: "AirPods Pro (2nd Gen)",
      description: "White case with blue tooth sticker.",
      category: "Electronics",
      locationFound: "Library Study Room B2",
      datePosted: "2023-06-01",
      imageUrl:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Pending",
      hasNewClaims: false,
    },
  ],

  setUploadedItems: (items) => set({ uploadedItems: items }),
}));
