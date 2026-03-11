"use client";

import { useState } from "react";
import { X, Send, MessageCircle, CheckCircle, Phone, MessageSquare } from "lucide-react";

interface ContactOwnerFormProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  language: string;
}

export default function ContactOwnerForm({ isOpen, onClose, property, language }: ContactOwnerFormProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    gender: "",
    moveInDate: "",
    stayDuration: "",
    numberOfOccupants: "1",
    roomType: "",
    occupation: "",
    companyCollege: "",
    budgetRange: "",
    foodPreference: "",
    needParking: "",
    message: "",
  });

  const content = {
    en: {
      contactOwner: "Contact Owner",
      basicInfo: "Basic Information",
      fullName: "Full Name",
      phone: "Phone Number",
      email: "Email Address",
      gender: "Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      stayDetails: "Stay Details",
      moveInDate: "Move-in Date",
      stayDuration: "Expected Stay Duration",
      duration1: "1-3 months",
      duration2: "3-6 months",
      duration3: "6-12 months",
      duration4: "1+ year",
      numberOfOccupants: "Number of Occupants",
      roomType: "Room Type Interested In",
      single: "Single",
      double: "Double Sharing",
      triple: "Triple Sharing",
      tenantBackground: "Tenant Background",
      occupation: "Occupation",
      student: "Student",
      working: "Working Professional",
      freelancer: "Freelancer",
      occupationOther: "Other",
      companyCollege: "Company / College Name",
      budgetPreferences: "Budget & Preferences",
      budgetRange: "Budget Range",
      foodPreference: "Food Preference",
      veg: "Veg",
      nonVeg: "Non-Veg",
      both: "Both",
      needParking: "Need Parking",
      yes: "Yes",
      no: "No",
      message: "Message / Inquiry",
      messagePlaceholder: "Hi, I'm interested in this property and would like to know if it's available from next month.",
      send: "Send Request",
      cancel: "Cancel",
      callOwner: "Call Owner",
      whatsappOwner: "WhatsApp Owner",
      success: "Request Sent Successfully!",
      successMessage: "Your request has been sent to the owner. They will contact you soon.",
      close: "Close",
      optional: "(optional)",
    },
    fr: {
      contactOwner: "Contacter le propriétaire",
      basicInfo: "Informations de base",
      fullName: "Nom complet",
      phone: "Numéro de téléphone",
      email: "Adresse e-mail",
      gender: "Genre",
      male: "Homme",
      female: "Femme",
      other: "Autre",
      stayDetails: "Détails du séjour",
      moveInDate: "Date d'emménagement",
      stayDuration: "Durée de séjour prévue",
      duration1: "1-3 mois",
      duration2: "3-6 mois",
      duration3: "6-12 mois",
      duration4: "1+ an",
      numberOfOccupants: "Nombre d'occupants",
      roomType: "Type de chambre souhaité",
      single: "Simple",
      double: "Double partagée",
      triple: "Triple partagée",
      tenantBackground: "Profil du locataire",
      occupation: "Profession",
      student: "Étudiant",
      working: "Professionnel",
      freelancer: "Freelance",
      occupationOther: "Autre",
      companyCollege: "Entreprise / École",
      budgetPreferences: "Budget et préférences",
      budgetRange: "Fourchette budgétaire",
      foodPreference: "Préférence alimentaire",
      veg: "Végétarien",
      nonVeg: "Non-végétarien",
      both: "Les deux",
      needParking: "Besoin de parking",
      yes: "Oui",
      no: "Non",
      message: "Message / Demande",
      messagePlaceholder: "Bonjour, je suis intéressé par cette propriété et j'aimerais savoir si elle est disponible à partir du mois prochain.",
      send: "Envoyer la demande",
      cancel: "Annuler",
      callOwner: "Appeler le propriétaire",
      whatsappOwner: "WhatsApp propriétaire",
      success: "Demande envoyée avec succès!",
      successMessage: "Votre demande a été envoyée au propriétaire. Il vous contactera bientôt.",
      close: "Fermer",
      optional: "(optionnel)",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data to send to backend
    const submissionData = {
      ...formData,
      pgId: property.id,
      ownerId: property.landlord?.id || "owner-id",
      listingTitle: property.title,
      listingLocation: property.location,
      timestamp: new Date().toISOString(),
    };
    
    console.log("Form submitted:", submissionData);
    // TODO: Send to backend API
    
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      onClose();
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        gender: "",
        moveInDate: "",
        stayDuration: "",
        numberOfOccupants: "1",
        roomType: "",
        occupation: "",
        companyCollege: "",
        budgetRange: "",
        foodPreference: "",
        needParking: "",
        message: "",
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCallOwner = () => {
    if (property.landlord?.phone) {
      window.location.href = `tel:${property.landlord.phone}`;
    }
  };

  const handleWhatsAppOwner = () => {
    if (property.landlord?.phone) {
      const message = encodeURIComponent(`Hi, I'm interested in your property: ${property.title}`);
      window.open(`https://wa.me/${property.landlord.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!formSubmitted ? (
          <>
            {/* Header - Sticky */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-green-600" />
                {t.contactOwner}
              </h2>
              <button
                onClick={onClose}
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {/* Property Info */}
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
                <p className="text-sm text-gray-600">{property.location}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 1. Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.basicInfo}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.fullName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder={t.fullName}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.phone} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        placeholder="+33 1 23 45 67 89"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.email} {t.optional}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.gender} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={handleChange}
                          required
                          className="mr-2"
                        />
                        {t.male}
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        {t.female}
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="other"
                          checked={formData.gender === "other"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        {t.other}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Stay Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.stayDetails}</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.moveInDate} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="moveInDate"
                        value={formData.moveInDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.stayDuration} <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="stayDuration"
                        value={formData.stayDuration}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="">Select duration</option>
                        <option value="1-3">{t.duration1}</option>
                        <option value="3-6">{t.duration2}</option>
                        <option value="6-12">{t.duration3}</option>
                        <option value="12+">{t.duration4}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.numberOfOccupants} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="numberOfOccupants"
                        value={formData.numberOfOccupants}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.roomType} <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="">Select room type</option>
                        <option value="single">{t.single}</option>
                        <option value="double">{t.double}</option>
                        <option value="triple">{t.triple}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Tenant Background */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.tenantBackground}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.occupation} <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select occupation</option>
                      <option value="student">{t.student}</option>
                      <option value="working">{t.working}</option>
                      <option value="freelancer">{t.freelancer}</option>
                      <option value="other">{t.occupationOther}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.companyCollege} {t.optional}
                    </label>
                    <input
                      type="text"
                      name="companyCollege"
                      value={formData.companyCollege}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder={t.companyCollege}
                    />
                  </div>
                </div>
              </div>

              {/* 4. Budget & Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.budgetPreferences}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.budgetRange} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g., €500 - €700"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.foodPreference} <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="foodPreference"
                        value={formData.foodPreference}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="">Select preference</option>
                        <option value="veg">{t.veg}</option>
                        <option value="non-veg">{t.nonVeg}</option>
                        <option value="both">{t.both}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.needParking} <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="needParking"
                        value={formData.needParking}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="">Select option</option>
                        <option value="yes">{t.yes}</option>
                        <option value="no">{t.no}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Message Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.message} <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder={t.messagePlaceholder}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {t.send}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleCallOwner}
                    className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    {t.callOwner}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppOwner}
                    className="py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {t.whatsappOwner}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
            </div>
          </>
        ) : (
          /* Success Message */
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.success}</h3>
            <p className="text-gray-600 mb-6">{t.successMessage}</p>
            <button
              onClick={onClose}
              type="button"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              {t.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
