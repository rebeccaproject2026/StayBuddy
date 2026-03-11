"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, X, MapPin, Check } from "lucide-react";

type PropertyType = "PG" | "Tenant" | null;
type PosterType = "Owner" | "Property Manager" | "Agent" | null;
type PropertyCategory = "Villa" | "Flat" | "House" | "Penthouse" | null;
type PGPresentIn = "An Independent Building" | "An Independent Flats" | "Present In A Society" | null;
type RoomCategory = "Single" | "Double" | "Triple" | "Four" | "Other";
type RoomDetails = {
  numberOfRooms: string;
  monthlyRent: string;
  securityDeposit: string;
  facilities: string[];
};
type PreferredGender = "Male" | "Female" | "Both" | null;
type TenantPreference = "Professionals" | "Students" | "Both" | null;

export default function PostPropertyPage() {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  
  // Step 1: Property Type & Basic Info
  const [propertyType, setPropertyType] = useState<PropertyType>(null);
  const [posterType, setPosterType] = useState<PosterType>(null);
  const [propertyCategory, setPropertyCategory] = useState<PropertyCategory>(null);
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Step 2: Property Details (PG)
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [googleMapLink, setGoogleMapLink] = useState("");
  const [operationalSince, setOperationalSince] = useState("");
  const [pgPresentIn, setPgPresentIn] = useState<PGPresentIn>(null);
  const [pgName, setPgName] = useState("");
  const [selectedRoomCategories, setSelectedRoomCategories] = useState<RoomCategory[]>([]);
  const [roomDetails, setRoomDetails] = useState<Record<RoomCategory, RoomDetails>>({
    Single: { numberOfRooms: "", monthlyRent: "", securityDeposit: "", facilities: [] },
    Double: { numberOfRooms: "", monthlyRent: "", securityDeposit: "", facilities: [] },
    Triple: { numberOfRooms: "", monthlyRent: "", securityDeposit: "", facilities: [] },
    Four: { numberOfRooms: "", monthlyRent: "", securityDeposit: "", facilities: [] },
    Other: { numberOfRooms: "", monthlyRent: "", securityDeposit: "", facilities: [] }
  });
  
  // Step 2: Property Details (Tenant)
  const [flatsInProject, setFlatsInProject] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [balcony, setBalcony] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [furnishing, setFurnishing] = useState<string[]>([]);
  const [areaMin, setAreaMin] = useState("");
  const [areaMax, setAreaMax] = useState("");
  const [societyName, setSocietyName] = useState("");
  
  // Step 3: Pricing & Preferences (PG)
  const [preferredGender, setPreferredGender] = useState<PreferredGender>(null);
  const [tenantPreference, setTenantPreference] = useState<TenantPreference>(null);
  const [pgRules, setPgRules] = useState<string[]>([]);
  const [noticePeriod, setNoticePeriod] = useState("");
  const [gateClosingTime, setGateClosingTime] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [foodProvided, setFoodProvided] = useState(false);
  const [meals, setMeals] = useState<string[]>([]);
  const [vegNonVeg, setVegNonVeg] = useState("");
  const [foodCharges, setFoodCharges] = useState("");
  const [commonAmenities, setCommonAmenities] = useState<string[]>([]);
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [parkingType, setParkingType] = useState("");
  
  // Step 3: Pricing & Preferences (Tenant)
  const [monthlyRentAmount, setMonthlyRentAmount] = useState("");
  const [securityAmount, setSecurityAmount] = useState("");
  const [maintenanceCharges, setMaintenanceCharges] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [availableFrom, setAvailableFrom] = useState("Immediately");
  const [availableDate, setAvailableDate] = useState("");
  const [additionalRooms, setAdditionalRooms] = useState<string[]>([]);
  const [overlooking, setOverlooking] = useState<string[]>([]);
  const [facing, setFacing] = useState("");
  const [societyAmenities, setSocietyAmenities] = useState<string[]>([]);
  const [tenantsPrefer, setTenantsPrefer] = useState<string[]>([]);
  const [localityDescription, setLocalityDescription] = useState("");
  
  // Step 4: Photos & Description
  const [uspCategory, setUspCategory] = useState("");
  const [uspText, setUspText] = useState("");
  const [pgDescription, setPgDescription] = useState("");
  
  // PG Room Images with status
  const [roomImages, setRoomImages] = useState<Array<{ id: string; name: string; status: 'vacant' | 'occupied'; file: File | null }>>([]);
  const [kitchenImages, setKitchenImages] = useState<File[]>([]);
  const [washroomImages, setWashroomImages] = useState<File[]>([]);
  const [commonAreaImages, setCommonAreaImages] = useState<File[]>([]);
  
  // Tenant Room Images (without status)
  const [tenantRoomImages, setTenantRoomImages] = useState<Array<{ id: string; name: string; file: File | null }>>([]);
  const [tenantKitchenImages, setTenantKitchenImages] = useState<File[]>([]);
  const [tenantWashroomImages, setTenantWashroomImages] = useState<File[]>([]);
  const [tenantCommonAreaImages, setTenantCommonAreaImages] = useState<File[]>([]);
  const [view360Url, setView360Url] = useState("");
  
  const [error, setError] = useState("");

  const roomFacilities = [
    { id: "bed", label: "Bed", icon: "🛏️" },
    { id: "washroom", label: "Attached Washroom", icon: "🚿" },
    { id: "cupboard", label: "Cupboard", icon: "🗄️" },
    { id: "table", label: "Table", icon: "🪑" },
    { id: "tv", label: "TV", icon: "📺" },
    { id: "wifi", label: "Wi-Fi", icon: "📶" },
    { id: "mattress", label: "Mattress", icon: "🛏️" },
    { id: "aircooler", label: "Air Cooler", icon: "❄️" }
  ];

  const pgRulesOptions = [
    { id: "guardian", label: "Guardian not allowed", icon: "👨‍👩‍👧" },
    { id: "nonveg", label: "Non-Veg Food", icon: "🍗" },
    { id: "gender", label: "Opposite Gender", icon: "⚥" },
    { id: "alcohol", label: "Alcohol", icon: "🍺" },
    { id: "smoking", label: "Smoking", icon: "🚬" }
  ];

  const servicesOptions = [
    { id: "laundry", label: "Laundry", icon: "🧺" },
    { id: "cleaning", label: "Room Cleaning", icon: "🧹" },
    { id: "warden", label: "Warden", icon: "👔" }
  ];

  const commonAmenitiesOptions = [
    { id: "fridge", label: "Fridge", icon: "🧊" },
    { id: "kitchen", label: "Kitchen for Self-cooking", icon: "🍳" },
    { id: "water", label: "RO Water", icon: "💧" },
    { id: "wifi", label: "Wi-Fi", icon: "📶" },
    { id: "tv", label: "TV", icon: "📺" },
    { id: "powerbackup", label: "Power Backup", icon: "🔋" },
    { id: "cctv", label: "CCTV", icon: "📹" },
    { id: "gym", label: "Gymnasium", icon: "🏋️" }
  ];

  const cities = [
    "Ahmedabad, Gujarat",
    "Ahmednagar, Lucknow",
    "Ahmed Nagar, Bangalor",
    "Ahmedpur, Bhopal",
    "Ahmednagar"
  ];

  const content = {
    en: {
      greeting: "Hi Khush,",
      // Step 1
      step1Title: "Property Type & Basic Information",
      postingFor: "You are posting Your property for",
      pg: "PG",
      tenant: "Tenant",
      postingPGAs: "You are posting this PG as",
      postingTenantAs: "You are posting this Property as",
      owner: "Owner",
      propertyManager: "Property Manager",
      agent: "Agent",
      propertyCategory: "Property Category",
      villa: "Villa",
      flat: "Flat",
      house: "House",
      penthouse: "Penthouse",
      cityTitle: "City where your PG is located?",
      cityTitleTenant: "City where your Property is located?",
      citySubtitle: "Make sure you enter the correct address for a Verification",
      cityPlaceholder: "Ah",
      // Step 2
      step2Title: "Property Details",
      addressTitle: "Enter Your PG Address",
      tenantAddressTitle: "Enter Your Property Address",
      addressSubtitle: "Make sure the address is correct, complete and precise",
      addressLabel: "Address",
      addressPlaceholder: "Enter Your Address",
      pincodeLabel: "Pincode",
      pincodePlaceholder: "Enter Your Pincode",
      landmarkLabel: "Landmark",
      landmarkPlaceholder: "Enter Your Landmark",
      googleMapLabel: "Google Map Link",
      googleMapPlaceholder: "Paste Google Maps link of your location",
      googleMapHelper: "Open Google Maps, search your location, click Share, and copy the link",
      operationalLabel: "PG Operational Since",
      operationalPlaceholder: "Enter Your PG Operational Since",
      presentInLabel: "PG Present In",
      presentInPlaceholder: "Select",
      independentBuilding: "An Independent Building",
      independentFlats: "An Independent Flats",
      pgSociety: "Present In A Society",
      pgNameLabel: "PG Name",
      pgNamePlaceholder: "Enter Your PG Name",
      roomCategoriesTitle: "Room Categories in your PG",
      roomCategoriesSubtitle: "Select all the available room categories",
      single: "Single",
      double: "Double",
      triple: "Triple",
      four: "Four",
      other: "Other",
      roomDetailsFor: "Room Details For",
      numberOfRooms: "No. Of Rooms In PG",
      numberOfRoomsPlaceholder: "Enter Number",
      monthlyRent: "Monthly Rent Per Bed",
      monthlyRentPlaceholder: "Enter Amount",
      securityDeposit: "Security Deposit Per Bed",
      securityDepositPlaceholder: "Enter Amount",
      roomFacilities: "Room Facilities",
      // Tenant property details
      flatsInProject: "No. of flats in project/Society",
      lessThan50: "<50",
      fiftyTo100: "50-100",
      moreThan100: ">100",
      bedroom: "Bedroom",
      bathroom: "Bathroom",
      balconyOptional: "Balcony(Optional)",
      all: "All",
      onePlus: "1+",
      twoPlus: "2+",
      threePlus: "3+",
      fourPlus: "4+",
      totalFloorsInBuilding: "Total number of Floors in buildings",
      floorNoOfProperty: "Floor No. of your Property",
      furnishingLabel: "Furnishing",
      unfurnished: "Unfurnished",
      semiFurnished: "Semi-Furnished",
      fullyFurnished: "Fully-Furnished",
      areaLabel: "Area",
      min: "MIN",
      max: "MAX",
      enterMinArea: "Enter MIN Area",
      enterMaxArea: "Enter MAX Area",
      societyName: "Society",
      enterSocietyName: "Enter Society Name",
      // Step 3
      step3Title: "Pricing & Preferences",
      preferredGenderTitle: "Preferred Gender",
      male: "Male",
      female: "Female",
      both: "Both",
      tenantPreferencesTitle: "Tenant Preferences",
      professionals: "Professionals",
      students: "Students",
      pgRulesTitle: "PG Rules",
      guardianNotAllowed: "Guardian not allowed",
      nonVegFood: "Non-Veg Food",
      oppositeGender: "Opposite Gender",
      alcohol: "Alcohol",
      smoking: "Smoking",
      noticePeriodTitle: "Notice period",
      noticePeriodPlaceholder: "Select",
      oneWeek: "1 Week",
      fifteenDays: "15 Days",
      oneMonth: "1 Month",
      twoMonths: "2 Month",
      noNoticePeriod: "No Notice Period",
      gateClosingTitle: "Gate Closing time",
      gateClosingPlaceholder: "Select",
      servicesTitle: "Services Available",
      laundry: "Laundry",
      roomCleaning: "Room Cleaning",
      warden: "Warden",
      foodProvidedLabel: "Food Provided",
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      vegNonVegLabel: "Veg/Nonveg Food Provided",
      veg: "Veg",
      vegAndNonVeg: "Veg & Non Veg",
      foodChargesLabel: "Food Charges",
      includedInRent: "Included in rent",
      perMealBasis: "Per meal Basis",
      fixedMonthlyAmount: "Fixed monthly Amount",
      commonAreaTitle: "Common Area Amenities",
      fridge: "Fridge",
      kitchenSelfCooking: "Kitchen for Self-cooking",
      roWater: "RO Water",
      wiFi: "Wi-Fi",
      tv: "TV",
      powerBackup: "Power Backup",
      cctv: "CCTV",
      gymnasium: "Gymnasium",
      parkingAvailability: "Parking Availability",
      twoWheeler: "2-Wheeler",
      carParking: "Car Parking",
      // Tenant pricing
      priceExpectTitle: "Price you Expect",
      monthlyRentLabel: "Monthly Rent",
      enterMonthlyRent: "Enter Monthly Rent",
      securityAmountOptional: "Security Amount(Optional)",
      enterSecurityAmount: "Enter Security Amount",
      maintenanceChargesOptional: "Maintenance Charges(Optional)",
      selectMaintenanceType: "Select",
      statusOfProperty: "Status Of your Property",
      availableFrom: "Available From",
      selectedDate: "Selected Date",
      immediately: "Immediately",
      availableDate: "Available Date",
      additionalDetailsTitle: "Additional Details",
      additionalRooms: "Additional Rooms",
      poojaRoom: "Pooja Room",
      servantRoom: "Servant Room",
      store: "Store",
      study: "Study",
      overlookingLabel: "Overlooking",
      gardenPark: "Garden/Park",
      mainRoad: "Main Road",
      pool: "Pool",
      facingLabel: "Facing",
      east: "East",
      north: "North",
      northEast: "North-East",
      northWest: "North-West",
      south: "South",
      southEast: "South-East",
      southWest: "South-West",
      west: "West",
      societyAmenitiesLabel: "Society Amenities",
      tenantsYouPrefer: "Tenants you Prefer",
      coupleFamily: "Couple/Family",
      vegetarians: "Vegetarians",
      withCompanyLease: "With Company lease",
      withoutPets: "Without Pets",
      localityDescriptionLabel: "Locality Description",
      localityDescriptionPlaceholder: "Tell us what you like & dislike about this locality.",
      // Step 4
      step4Title: "Photos & Description",
      writeUSPTitle: "Write a USP about your property",
      selectCategoryLabel: "Select Category",
      selectCategoryPlaceholder: "Select",
      food: "Food",
      locality: "Locality",
      amenities: "Amenities",
      others: "Others",
      writeUSPLabel: "Write USP",
      writeUSPPlaceholder: "Write USP",
      pgDescriptionTitle: "Property Description",
      pgDescriptionSubtitle: "Write a brief description of your property",
      pgDescriptionLabel: "Description",
      pgDescriptionPlaceholder: "Enter Description",
      sampleDescription: "Sample Description",
      sample1: "Sample 1",
      sample2: "Sample 2",
      editAndUse: "Edit & Use",
      sampleText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      uploadPicturesTitle: "Upload Pictures",
      uploadSubtitle: "Property with Photos Get More Attention from Buyers",
      uploadInfo: "Accepted formats are .jpg, .jpeg, .gif, .bmp & .png | Minimum dimension allowed 600*400 Pixel | Maximum size allowed is 6 MB",
      roomsImages: "Rooms Images",
      roomsImagesSubtitle: "Upload images for each room and mark their availability status",
      tenantRoomsImages: "Room Images",
      tenantRoomsImagesSubtitle: "Upload images for each room in your property",
      addRoom: "Add Room",
      roomName: "Room Name",
      roomStatus: "Room Status",
      vacant: "Vacant",
      occupied: "Occupied",
      uploadRoomImage: "Upload Room Image",
      removeRoom: "Remove Room",
      kitchenImages: "Kitchen Images",
      washroomImages: "Washroom Images",
      commonAreaImages: "Common Area Images",
      view360Section: "360° Virtual Tour",
      view360Subtitle: "Add a 360° virtual tour link for better property showcase",
      view360Label: "360° View URL",
      view360Placeholder: "Enter 360° virtual tour link (e.g., Matterport, Google Street View)",
      uploadImages: "Upload Images",
      imagesUploaded: "images uploaded",
      singleRoom: "Single Room",
      buildingView: "Building View",
      commonArea: "Common Area",
      commonAmenities: "Common Amenities",
      kitchen: "Kitchen",
      neighbourhoodView: "Neighbourhood View",
      mapView: "Map View",
      // Success
      congratulations: "Congratulation..!",
      propertyPosted: "Your property has been posted Successfully!",
      // Common
      continue: "Continue",
      back: "Back",
      selectError: "Please select an option to continue",
      cityError: "Please select a city from suggestions",
      addressError: "Please fill all required fields",
      pgNameError: "Please enter PG name",
      roomCategoriesError: "Please select at least one room category",
      rentDetailsError: "Please fill all required fields",
      preferencesError: "Please select both preferences",
      uspError: "Please select category and write USP",
      descriptionError: "Please enter description",
      priceError: "Please enter monthly rent",
    },
    fr: {
      greeting: "Salut Khush,",
      step1Title: "Type de propriété et informations de base",
      postingFor: "Vous publiez votre propriété pour",
      pg: "PG",
      tenant: "Locataire",
      postingPGAs: "Vous publiez ce PG en tant que",
      postingTenantAs: "Vous publiez cette propriété en tant que",
      owner: "Propriétaire",
      propertyManager: "Gestionnaire immobilier",
      agent: "Agent",
      propertyCategory: "Catégorie de propriété",
      villa: "Villa",
      flat: "Appartement",
      house: "Maison",
      penthouse: "Penthouse",
      cityTitle: "Ville où se trouve votre PG?",
      cityTitleTenant: "Ville où se trouve votre propriété?",
      citySubtitle: "Assurez-vous d'entrer l'adresse correcte pour une vérification",
      cityPlaceholder: "Ah",
      step2Title: "Détails de la propriété",
      addressTitle: "Entrez l'adresse de votre PG",
      tenantAddressTitle: "Entrez l'adresse de votre propriété",
      addressSubtitle: "Assurez-vous que l'adresse est correcte, complète et précise",
      addressLabel: "Adresse",
      addressPlaceholder: "Entrez votre adresse",
      pincodeLabel: "Code postal",
      pincodePlaceholder: "Entrez votre code postal",
      landmarkLabel: "Point de repère",
      landmarkPlaceholder: "Entrez votre point de repère",
      googleMapLabel: "Lien Google Maps",
      googleMapPlaceholder: "Collez le lien Google Maps de votre emplacement",
      googleMapHelper: "Ouvrez Google Maps, recherchez votre emplacement, cliquez sur Partager et copiez le lien",
      operationalLabel: "PG opérationnel depuis",
      operationalPlaceholder: "Entrez depuis quand",
      presentInLabel: "PG présent dans",
      presentInPlaceholder: "Sélectionner",
      independentBuilding: "Un bâtiment indépendant",
      independentFlats: "Des appartements indépendants",
      pgSociety: "Présent dans une société",
      pgNameLabel: "Nom du PG",
      pgNamePlaceholder: "Entrez le nom de votre PG",
      roomCategoriesTitle: "Catégories de chambres dans votre PG",
      roomCategoriesSubtitle: "Sélectionnez toutes les catégories disponibles",
      single: "Simple",
      double: "Double",
      triple: "Triple",
      four: "Quatre",
      other: "Autre",
      roomDetailsFor: "Détails de la chambre pour",
      numberOfRooms: "Nombre de chambres dans PG",
      numberOfRoomsPlaceholder: "Entrez le nombre",
      monthlyRent: "Loyer mensuel par lit",
      monthlyRentPlaceholder: "Entrez le montant",
      securityDeposit: "Dépôt de garantie par lit",
      securityDepositPlaceholder: "Entrez le montant",
      roomFacilities: "Équipements de la chambre",
      flatsInProject: "Nombre d'appartements dans le projet",
      lessThan50: "<50",
      fiftyTo100: "50-100",
      moreThan100: ">100",
      bedroom: "Chambre",
      bathroom: "Salle de bain",
      balconyOptional: "Balcon(Optionnel)",
      all: "Tous",
      onePlus: "1+",
      twoPlus: "2+",
      threePlus: "3+",
      fourPlus: "4+",
      totalFloorsInBuilding: "Nombre total d'étages",
      floorNoOfProperty: "Numéro d'étage",
      furnishingLabel: "Ameublement",
      unfurnished: "Non meublé",
      semiFurnished: "Semi-meublé",
      fullyFurnished: "Entièrement meublé",
      areaLabel: "Zone",
      min: "MIN",
      max: "MAX",
      enterMinArea: "Entrez la zone MIN",
      enterMaxArea: "Entrez la zone MAX",
      societyName: "Société",
      enterSocietyName: "Entrez le nom de la société",
      step3Title: "Prix et préférences",
      preferredGenderTitle: "Genre préféré",
      male: "Homme",
      female: "Femme",
      both: "Les deux",
      tenantPreferencesTitle: "Préférences de locataire",
      professionals: "Professionnels",
      students: "Étudiants",
      pgRulesTitle: "Règles du PG",
      guardianNotAllowed: "Tuteur non autorisé",
      nonVegFood: "Nourriture non végétarienne",
      oppositeGender: "Sexe opposé",
      alcohol: "Alcool",
      smoking: "Fumer",
      noticePeriodTitle: "Période de préavis",
      noticePeriodPlaceholder: "Sélectionner",
      oneWeek: "1 semaine",
      fifteenDays: "15 jours",
      oneMonth: "1 mois",
      twoMonths: "2 mois",
      noNoticePeriod: "Pas de période de préavis",
      gateClosingTitle: "Heure de fermeture",
      gateClosingPlaceholder: "Sélectionner",
      servicesTitle: "Services disponibles",
      laundry: "Blanchisserie",
      roomCleaning: "Nettoyage de chambre",
      warden: "Gardien",
      foodProvidedLabel: "Nourriture fournie",
      breakfast: "Petit-déjeuner",
      lunch: "Déjeuner",
      dinner: "Dîner",
      vegNonVegLabel: "Nourriture végétarienne/non végétarienne",
      veg: "Végétarien",
      vegAndNonVeg: "Végétarien et non végétarien",
      foodChargesLabel: "Frais de nourriture",
      includedInRent: "Inclus dans le loyer",
      perMealBasis: "Par repas",
      fixedMonthlyAmount: "Montant mensuel fixe",
      commonAreaTitle: "Équipements des espaces communs",
      fridge: "Réfrigérateur",
      kitchenSelfCooking: "Cuisine pour cuisiner soi-même",
      roWater: "Eau RO",
      wiFi: "Wi-Fi",
      tv: "TV",
      powerBackup: "Alimentation de secours",
      cctv: "CCTV",
      gymnasium: "Gymnase",
      parkingAvailability: "Disponibilité du stationnement",
      twoWheeler: "Deux-roues",
      carParking: "Parking voiture",
      priceExpectTitle: "Prix que vous attendez",
      monthlyRentLabel: "Loyer mensuel",
      enterMonthlyRent: "Entrez le loyer mensuel",
      securityAmountOptional: "Montant de la caution(Optionnel)",
      enterSecurityAmount: "Entrez le montant",
      maintenanceChargesOptional: "Frais de maintenance(Optionnel)",
      selectMaintenanceType: "Sélectionner",
      statusOfProperty: "Statut de votre propriété",
      availableFrom: "Disponible à partir de",
      selectedDate: "Date sélectionnée",
      immediately: "Immédiatement",
      availableDate: "Date disponible",
      additionalDetailsTitle: "Détails supplémentaires",
      additionalRooms: "Chambres supplémentaires",
      poojaRoom: "Salle de prière",
      servantRoom: "Chambre de service",
      store: "Magasin",
      study: "Bureau",
      overlookingLabel: "Vue sur",
      gardenPark: "Jardin/Parc",
      mainRoad: "Route principale",
      pool: "Piscine",
      facingLabel: "Orientation",
      east: "Est",
      north: "Nord",
      northEast: "Nord-Est",
      northWest: "Nord-Ouest",
      south: "Sud",
      southEast: "Sud-Est",
      southWest: "Sud-Ouest",
      west: "Ouest",
      societyAmenitiesLabel: "Équipements de la société",
      tenantsYouPrefer: "Locataires que vous préférez",
      coupleFamily: "Couple/Famille",
      vegetarians: "Végétariens",
      withCompanyLease: "Avec bail d'entreprise",
      withoutPets: "Sans animaux",
      localityDescriptionLabel: "Description de la localité",
      localityDescriptionPlaceholder: "Dites-nous ce que vous aimez.",
      step4Title: "Photos et description",
      writeUSPTitle: "Écrivez un USP sur votre propriété",
      selectCategoryLabel: "Sélectionnez la catégorie",
      selectCategoryPlaceholder: "Sélectionner",
      food: "Nourriture",
      locality: "Localité",
      amenities: "Équipements",
      others: "Autres",
      writeUSPLabel: "Écrire USP",
      writeUSPPlaceholder: "Écrire USP",
      pgDescriptionTitle: "Description de la propriété",
      pgDescriptionSubtitle: "Rédigez une brève description",
      pgDescriptionLabel: "Description",
      pgDescriptionPlaceholder: "Entrez la description",
      sampleDescription: "Exemple de description",
      sample1: "Exemple 1",
      sample2: "Exemple 2",
      editAndUse: "Modifier et utiliser",
      sampleText: "Lorem Ipsum est simplement un texte factice.",
      uploadPicturesTitle: "Télécharger des photos",
      uploadSubtitle: "Les propriétés avec photos attirent plus l'attention",
      uploadInfo: "Formats acceptés: .jpg, .jpeg, .gif, .bmp et .png",
      roomsImages: "Images des chambres",
      roomsImagesSubtitle: "Téléchargez des images pour chaque chambre et marquez leur statut de disponibilité",
      tenantRoomsImages: "Images des chambres",
      tenantRoomsImagesSubtitle: "Téléchargez des images pour chaque chambre de votre propriété",
      addRoom: "Ajouter une chambre",
      roomName: "Nom de la chambre",
      roomStatus: "Statut de la chambre",
      vacant: "Vacant",
      occupied: "Occupé",
      uploadRoomImage: "Télécharger l'image de la chambre",
      removeRoom: "Supprimer la chambre",
      kitchenImages: "Images de la cuisine",
      washroomImages: "Images de la salle de bain",
      commonAreaImages: "Images de l'espace commun",
      view360Section: "Visite virtuelle 360°",
      view360Subtitle: "Ajoutez un lien de visite virtuelle 360° pour une meilleure présentation",
      view360Label: "URL de la vue 360°",
      view360Placeholder: "Entrez le lien de la visite virtuelle 360° (ex: Matterport, Google Street View)",
      uploadImages: "Télécharger des images",
      imagesUploaded: "images téléchargées",
      singleRoom: "Chambre simple",
      buildingView: "Vue du bâtiment",
      commonArea: "Espace commun",
      commonAmenities: "Équipements communs",
      kitchen: "Cuisine",
      neighbourhoodView: "Vue du quartier",
      mapView: "Vue de la carte",
      congratulations: "Félicitations..!",
      propertyPosted: "Votre propriété a été publiée avec succès!",
      continue: "Continuer",
      back: "Retour",
      selectError: "Veuillez sélectionner une option",
      cityError: "Veuillez sélectionner une ville",
      addressError: "Veuillez remplir tous les champs obligatoires",
      pgNameError: "Veuillez entrer le nom du PG",
      roomCategoriesError: "Veuillez sélectionner au moins une catégorie",
      rentDetailsError: "Veuillez remplir tous les champs obligatoires",
      preferencesError: "Veuillez sélectionner les deux préférences",
      uspError: "Veuillez sélectionner la catégorie et écrire l'USP",
      descriptionError: "Veuillez entrer la description",
      priceError: "Veuillez entrer le loyer mensuel",
    }
  };

  const t = content[language];
  const filteredCities = cities.filter(c => 
    c.toLowerCase().includes(city.toLowerCase())
  );
  
  // Currency symbol based on language from translations
  const { t: translate } = useLanguage();
  const currencySymbol = translate('currency.symbol');

  // Handler functions
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueStep1 = () => {
    if (!propertyType || !posterType || (propertyType === "Tenant" && !propertyCategory) || !selectedCity) {
      setError(t.selectError);
      return;
    }
    setError("");
    setStep(2);
    scrollToTop();
  };

  const handleContinueStep2 = () => {
    if (propertyType === "PG") {
      if (!address.trim() || !pincode.trim() || !landmark.trim() || !googleMapLink.trim() || !operationalSince.trim() || !pgPresentIn || !pgName.trim() || selectedRoomCategories.length === 0) {
        setError(t.addressError);
        return;
      }
      // Validate room details
      for (const category of selectedRoomCategories) {
        const details = roomDetails[category];
        if (!details.numberOfRooms || !details.monthlyRent || !details.securityDeposit) {
          setError(t.rentDetailsError);
          return;
        }
      }
    } else if (propertyType === "Tenant") {
      if (!address.trim() || !pincode.trim() || !landmark.trim() || !googleMapLink.trim() || !flatsInProject || !bedrooms || !bathrooms || !totalFloors || !floorNumber || !societyName.trim()) {
        setError(t.addressError);
        return;
      }
    }
    setError("");
    setStep(3);
    scrollToTop();
  };

  const handleContinueStep3 = () => {
    if (propertyType === "PG") {
      if (!preferredGender || !tenantPreference) {
        setError(t.preferencesError);
        return;
      }
    } else if (propertyType === "Tenant") {
      if (!monthlyRentAmount.trim()) {
        setError(t.priceError);
        return;
      }
    }
    setError("");
    setStep(4);
    scrollToTop();
  };

  const handleContinueStep4 = () => {
    if (!pgDescription.trim()) {
      setError(t.descriptionError);
      return;
    }
    setError("");
    setStep(5); // Success step
    scrollToTop();
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      scrollToTop();
    }
  };

  const handleCitySelect = (selectedCity: string) => {
    setSelectedCity(selectedCity);
    setCity(selectedCity.split(',')[0]);
    setShowSuggestions(false);
  };

  const toggleRoomCategory = (category: RoomCategory) => {
    setSelectedRoomCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleFacility = (category: RoomCategory, facility: string) => {
    setRoomDetails(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        facilities: prev[category].facilities.includes(facility)
          ? prev[category].facilities.filter(f => f !== facility)
          : [...prev[category].facilities, facility]
      }
    }));
  };

  const updateRoomDetail = (category: RoomCategory, field: keyof RoomDetails, value: string) => {
    setRoomDetails(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const togglePGRule = (rule: string) => {
    setPgRules(prev => 
      prev.includes(rule) ? prev.filter(r => r !== rule) : [...prev, rule]
    );
  };

  const toggleService = (service: string) => {
    setServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const toggleMeal = (meal: string) => {
    setMeals(prev => 
      prev.includes(meal) ? prev.filter(m => m !== meal) : [...prev, meal]
    );
  };

  const toggleCommonAmenity = (amenity: string) => {
    setCommonAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleFurnishing = (item: string) => {
    setFurnishing(prev => 
      prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item]
    );
  };

  const toggleAdditionalRoom = (room: string) => {
    setAdditionalRooms(prev => 
      prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]
    );
  };

  const toggleOverlooking = (item: string) => {
    setOverlooking(prev => 
      prev.includes(item) ? prev.filter(o => o !== item) : [...prev, item]
    );
  };

  const toggleSocietyAmenity = (amenity: string) => {
    setSocietyAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleTenantPrefer = (tenant: string) => {
    setTenantsPrefer(prev => 
      prev.includes(tenant) ? prev.filter(t => t !== tenant) : [...prev, tenant]
    );
  };

  const useSampleDescription = (sample: string) => {
    setPgDescription(sample);
  };

  // PG Room Image Handlers
  const addRoomImage = () => {
    const newRoom = {
      id: `room-${Date.now()}`,
      name: `Room ${roomImages.length + 1}`,
      status: 'vacant' as const,
      file: null
    };
    setRoomImages(prev => [...prev, newRoom]);
  };

  const removeRoomImage = (id: string) => {
    setRoomImages(prev => prev.filter(room => room.id !== id));
  };

  const updateRoomImage = (id: string, field: 'name' | 'status', value: string) => {
    setRoomImages(prev => prev.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ));
  };

  const handleRoomImageUpload = (id: string, file: File | null) => {
    setRoomImages(prev => prev.map(room => 
      room.id === id ? { ...room, file } : room
    ));
  };

  const handleKitchenImageUpload = (files: FileList | null) => {
    if (files) {
      setKitchenImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleWashroomImageUpload = (files: FileList | null) => {
    if (files) {
      setWashroomImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleCommonAreaImageUpload = (files: FileList | null) => {
    if (files) {
      setCommonAreaImages(prev => [...prev, ...Array.from(files)]);
    }
  };
  
  // Tenant Room Image Handlers
  const addTenantRoomImage = () => {
    const newRoom = {
      id: `tenant-room-${Date.now()}`,
      name: `Room ${tenantRoomImages.length + 1}`,
      file: null
    };
    setTenantRoomImages(prev => [...prev, newRoom]);
  };

  const removeTenantRoomImage = (id: string) => {
    setTenantRoomImages(prev => prev.filter(room => room.id !== id));
  };

  const updateTenantRoomImage = (id: string, field: 'name', value: string) => {
    setTenantRoomImages(prev => prev.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ));
  };

  const handleTenantRoomImageUpload = (id: string, file: File | null) => {
    setTenantRoomImages(prev => prev.map(room => 
      room.id === id ? { ...room, file } : room
    ));
  };

  const handleTenantKitchenImageUpload = (files: FileList | null) => {
    if (files) {
      setTenantKitchenImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleTenantWashroomImageUpload = (files: FileList | null) => {
    if (files) {
      setTenantWashroomImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleTenantCommonAreaImageUpload = (files: FileList | null) => {
    if (files) {
      setTenantCommonAreaImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  // Auto redirect after success
  useEffect(() => {
    if (step === 5) {
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 min-h-screen">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step === s ? 'bg-primary text-white scale-110' : 
                  step > s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 4 && <div className={`w-12 h-1 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">Step {step} of 4</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto pb-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            {/* STEP 1: Property Type & Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">{t.greeting}</h2>
                  <p className="text-gray-600 text-lg mb-6">{t.step1Title}</p>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">{t.postingFor}</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['PG', 'Tenant'].map((type) => (
                      <label key={type} className={`flex items-center justify-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
                        propertyType === type ? 'border-primary bg-primary/10' : 'border-gray-200'
                      }`}>
                        <input 
                          type="radio" 
                          name="propertyType" 
                          value={type} 
                          checked={propertyType === type} 
                          onChange={(e) => setPropertyType(e.target.value as PropertyType)} 
                          className="w-5 h-5 text-primary focus:ring-primary" 
                        />
                        <span className="text-lg font-medium text-gray-700">{type === 'PG' ? t.pg : t.tenant}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Poster Type */}
                {propertyType && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">
                      {propertyType === "PG" ? t.postingPGAs : t.postingTenantAs}
                    </label>
                    <div className="space-y-3">
                      {['Owner', 'Property Manager', 'Agent'].map((type) => (
                        <label key={type} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
                          posterType === type ? 'border-primary bg-primary/10' : 'border-gray-200'
                        }`}>
                          <input 
                            type="radio" 
                            name="posterType" 
                            value={type} 
                            checked={posterType === type} 
                            onChange={(e) => setPosterType(e.target.value as PosterType)} 
                            className="w-5 h-5 text-primary focus:ring-primary" 
                          />
                          <span className="text-lg font-medium text-gray-700">
                            {type === 'Owner' ? t.owner : type === 'Property Manager' ? t.propertyManager : t.agent}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Category (Tenant only) */}
                {propertyType === "Tenant" && posterType && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">{t.propertyCategory}</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Villa', 'Flat', 'House', 'Penthouse'].map((category) => (
                        <label key={category} className={`flex items-center justify-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
                          propertyCategory === category ? 'border-primary bg-primary/10' : 'border-gray-200'
                        }`}>
                          <input 
                            type="radio" 
                            name="propertyCategory" 
                            value={category} 
                            checked={propertyCategory === category} 
                            onChange={(e) => setPropertyCategory(e.target.value as PropertyCategory)} 
                            className="w-5 h-5 text-primary focus:ring-primary" 
                          />
                          <span className="text-base font-medium text-gray-700">
                            {category === 'Villa' ? t.villa : category === 'Flat' ? t.flat : category === 'House' ? t.house : t.penthouse}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* City Selection */}
                {posterType && (propertyType === "PG" || propertyCategory) && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      {propertyType === "PG" ? t.cityTitle : t.cityTitleTenant}
                    </label>
                    <p className="text-sm text-gray-500 mb-3">{t.citySubtitle}</p>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={city} 
                        onChange={(e) => {
                          setCity(e.target.value);
                          setShowSuggestions(true);
                          setSelectedCity("");
                        }} 
                        onFocus={() => setShowSuggestions(true)}
                        placeholder={t.cityPlaceholder} 
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-lg" 
                      />
                      {selectedCity && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <span className="text-gray-700">{selectedCity.split(',')[0]}</span>
                          <button 
                            onClick={() => {
                              setSelectedCity("");
                              setCity("");
                            }}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {showSuggestions && city && !selectedCity && filteredCities.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
                          {filteredCities.map((cityOption, index) => (
                            <button
                              key={index}
                              onClick={() => handleCitySelect(cityOption)}
                              className="w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                            >
                              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                              <span className="text-gray-700">{cityOption}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button 
                  onClick={handleContinueStep1} 
                  className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  {t.continue}
                </button>
              </div>
            )}

            {/* STEP 2: Property Details */}
            {step === 2 && (
              <div className="space-y-6">
                <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4">
                  <ArrowLeft className="w-5 h-5" />{t.back}
                </button>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">{t.step2Title}</h2>
                  <p className="text-gray-600 mb-4">{t.addressSubtitle}</p>
                  {selectedCity && (
                    <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg w-fit mb-4">
                      <span className="text-primary font-medium">{selectedCity.split(',')[0]}</span>
                    </div>
                  )}
                </div>

                {/* Address Section */}
                <div className="space-y-4 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800">{propertyType === "PG" ? t.addressTitle : t.tenantAddressTitle}</h3>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {t.addressLabel}<span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      placeholder={t.addressPlaceholder} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        {t.pincodeLabel}<span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={pincode} 
                        onChange={(e) => setPincode(e.target.value)} 
                        placeholder={t.pincodePlaceholder} 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        {t.landmarkLabel}<span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={landmark} 
                        onChange={(e) => setLandmark(e.target.value)} 
                        placeholder={t.landmarkPlaceholder} 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {t.googleMapLabel}<span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="url" 
                      value={googleMapLink} 
                      onChange={(e) => setGoogleMapLink(e.target.value)} 
                      placeholder={t.googleMapPlaceholder} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                    />
                    <p className="text-sm text-gray-500 mt-1 flex items-start gap-1">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{t.googleMapHelper}</span>
                    </p>
                  </div>
                </div>

                {/* PG Specific Details */}
                {propertyType === "PG" && (
                  <>
                    <div className="space-y-4 pb-4 border-b border-gray-200">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          {t.operationalLabel}<span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={operationalSince} 
                          onChange={(e) => setOperationalSince(e.target.value)} 
                          placeholder={t.operationalPlaceholder} 
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          {t.presentInLabel}<span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: 'An Independent Building', label: t.independentBuilding },
                            { value: 'An Independent Flats', label: t.independentFlats },
                            { value: 'Present In A Society', label: t.pgSociety }
                          ].map((option) => (
                            <label key={option.value} className={`flex items-center gap-4 p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
                              pgPresentIn === option.value ? 'border-primary bg-primary/10' : 'border-gray-200'
                            }`}>
                              <input 
                                type="radio" 
                                name="pgPresentIn" 
                                value={option.value} 
                                checked={pgPresentIn === option.value} 
                                onChange={(e) => setPgPresentIn(e.target.value as PGPresentIn)} 
                                className="w-5 h-5 text-primary focus:ring-primary" 
                              />
                              <span className="text-base font-medium text-gray-700">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          {t.pgNameLabel}<span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={pgName} 
                          onChange={(e) => setPgName(e.target.value)} 
                          placeholder={t.pgNamePlaceholder} 
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                        />
                      </div>
                    </div>

                    {/* Room Categories */}
                    <div className="space-y-4 pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800">{t.roomCategoriesTitle}</h3>
                      <p className="text-sm text-gray-600">{t.roomCategoriesSubtitle}</p>
                      <div className="grid grid-cols-3 gap-3">
                        {(['Single', 'Double', 'Triple', 'Four', 'Other'] as RoomCategory[]).map((category) => (
                          <button
                            key={category}
                            onClick={() => toggleRoomCategory(category)}
                            className={`py-3 px-4 border-2 rounded-xl transition-all ${
                              selectedRoomCategories.includes(category)
                                ? 'border-primary bg-primary/10 text-primary font-medium'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {category === 'Single' ? t.single : category === 'Double' ? t.double : category === 'Triple' ? t.triple : category === 'Four' ? t.four : t.other}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Room Details for each selected category */}
                    {selectedRoomCategories.map((category) => (
                      <div key={category} className="space-y-4 pb-4 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-primary">{t.roomDetailsFor} {category} {t.roomCategoriesTitle.split(' ')[0]}</h3>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            {t.numberOfRooms}<span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            value={roomDetails[category].numberOfRooms} 
                            onChange={(e) => updateRoomDetail(category, 'numberOfRooms', e.target.value)} 
                            placeholder={t.numberOfRoomsPlaceholder} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              {t.monthlyRent}<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{currencySymbol}</span>
                              <input 
                                type="text" 
                                value={roomDetails[category].monthlyRent} 
                                onChange={(e) => updateRoomDetail(category, 'monthlyRent', e.target.value)} 
                                placeholder={t.monthlyRentPlaceholder} 
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              {t.securityDeposit}<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{currencySymbol}</span>
                              <input 
                                type="text" 
                                value={roomDetails[category].securityDeposit} 
                                onChange={(e) => updateRoomDetail(category, 'securityDeposit', e.target.value)} 
                                placeholder={t.securityDepositPlaceholder} 
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-3">{t.roomFacilities}</label>
                          <div className="grid grid-cols-2 gap-2">
                            {roomFacilities.map((facility) => (
                              <button
                                key={facility.id}
                                onClick={() => toggleFacility(category, facility.id)}
                                className={`flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                                  roomDetails[category].facilities.includes(facility.id)
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span>{facility.icon}</span>
                                  <span className="text-sm text-gray-700">{facility.label}</span>
                                </span>
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  roomDetails[category].facilities.includes(facility.id) ? 'border-primary bg-primary' : 'border-gray-300'
                                }`}>
                                  {roomDetails[category].facilities.includes(facility.id) && <Check className="w-3 h-3 text-white" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Tenant Specific Details */}
                {propertyType === "Tenant" && (
                  <>
                    <div className="space-y-4 pb-4 border-b border-gray-200">
                      <div>
                        <label className="block text-gray-700 font-medium mb-3">{t.flatsInProject}</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['<50', '50-100', '>100'].map((option) => (
                            <button
                              key={option}
                              onClick={() => setFlatsInProject(option)}
                              className={`py-3 px-4 border-2 rounded-xl transition-all ${
                                flatsInProject === option
                                  ? 'border-primary bg-primary/10 text-primary font-medium'
                                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-3">{t.bedroom}</label>
                        <div className="grid grid-cols-5 gap-2">
                          {['All', '1+', '2+', '3+', '4+'].map((option) => (
                            <button
                              key={option}
                              onClick={() => setBedrooms(option)}
                              className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${
                                bedrooms === option
                                  ? 'border-primary bg-primary/10 text-primary font-medium'
                                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-3">{t.bathroom}</label>
                        <div className="grid grid-cols-5 gap-2">
                          {['All', '1+', '2+', '3+', '4+'].map((option) => (
                            <button
                              key={option}
                              onClick={() => setBathrooms(option)}
                              className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${
                                bathrooms === option
                                  ? 'border-primary bg-primary/10 text-primary font-medium'
                                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-3">{t.balconyOptional}</label>
                        <div className="grid grid-cols-5 gap-2">
                          {['All', '1+', '2+', '3+', '4+'].map((option) => (
                            <button
                              key={option}
                              onClick={() => setBalcony(option)}
                              className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${
                                balcony === option
                                  ? 'border-primary bg-primary/10 text-primary font-medium'
                                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">{t.totalFloorsInBuilding}</label>
                          <select 
                            value={totalFloors} 
                            onChange={(e) => setTotalFloors(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none bg-white cursor-pointer"
                          >
                            <option value="">{t.presentInPlaceholder}</option>
                            {Array.from({length: 50}, (_, i) => i + 1).map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">{t.floorNoOfProperty}</label>
                          <select 
                            value={floorNumber} 
                            onChange={(e) => setFloorNumber(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none bg-white cursor-pointer"
                          >
                            <option value="">{t.presentInPlaceholder}</option>
                            {Array.from({length: 50}, (_, i) => i + 1).map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-3">{t.furnishingLabel}</label>
                        <div className="space-y-2">
                          {['Unfurnished', 'Semi-Furnished', 'Fully-Furnished'].map((option) => (
                            <button
                              key={option}
                              onClick={() => toggleFurnishing(option)}
                              className={`w-full flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                                furnishing.includes(option)
                                  ? 'border-primary bg-primary/10'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                            >
                              <span className="text-gray-700">{option}</span>
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                furnishing.includes(option) ? 'border-primary bg-primary' : 'border-gray-300'
                              }`}>
                                {furnishing.includes(option) && <Check className="w-3 h-3 text-white" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">{t.areaLabel}</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.min}</label>
                            <input 
                              type="text" 
                              value={areaMin} 
                              onChange={(e) => setAreaMin(e.target.value)} 
                              placeholder={t.enterMinArea} 
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.max}</label>
                            <input 
                              type="text" 
                              value={areaMax} 
                              onChange={(e) => setAreaMax(e.target.value)} 
                              placeholder={t.enterMaxArea} 
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          {t.societyName}<span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={societyName} 
                          onChange={(e) => setSocietyName(e.target.value)} 
                          placeholder={t.enterSocietyName} 
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                        />
                      </div>
                    </div>
                  </>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button 
                  onClick={handleContinueStep2} 
                  className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  {t.continue}
                </button>
              </div>
            )}

            {/* STEP 3: Pricing & Preferences */}
            {step === 3 && (
              <div className="space-y-6">
                <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4">
                  <ArrowLeft className="w-5 h-5" />{t.back}
                </button>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">{t.step3Title}</h2>
                </div>

                {/* PG Pricing & Preferences */}
                {propertyType === "PG" && (
                  <>
                    <div className="space-y-4 pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800">{t.preferredGenderTitle}</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {(['Male', 'Female', 'Both'] as PreferredGender[]).map((gender) => (
                          <button
                            key={gender}
                            onClick={() => setPreferredGender(gender)}
                            className={`py-3 px-4 border-2 rounded-xl transition-all ${
                              preferredGender === gender
                                ? 'border-primary bg-primary/10 text-primary font-medium'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {gender === 'Male' ? t.male : gender === 'Female' ? t.female : t.both}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800">{t.tenantPreferencesTitle}</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {(['Professionals', 'Students', 'Both'] as TenantPreference[]).map((pref) => (
                          <button
                            key={pref}
                            onClick={() => setTenantPreference(pref)}
                            className={`py-3 px-4 border-2 rounded-xl transition-all ${
                              tenantPreference === pref
                                ? 'border-primary bg-primary/10 text-primary font-medium'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {pref === 'Professionals' ? t.professionals : pref === 'Students' ? t.students : t.both}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800">{t.pgRulesTitle}</h3>
                      <div className="space-y-2">
                        {pgRulesOptions.map((rule) => (
                          <button
                            key={rule.id}
                            onClick={() => togglePGRule(rule.id)}
                            className={`w-full flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                              pgRules.includes(rule.id)
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{rule.icon}</span>
                              <span className="text-gray-700">{rule.label}</span>
                            </span>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              pgRules.includes(rule.id) ? 'border-primary bg-primary' : 'border-gray-300'
                            }`}>
                              {pgRules.includes(rule.id) && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">{t.noticePeriodTitle}</label>
                          <select 
                            value={noticePeriod} 
                            onChange={(e) => setNoticePeriod(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none bg-white cursor-pointer"
                          >
                            <option value="">{t.noticePeriodPlaceholder}</option>
                            <option value="1 Week">{t.oneWeek}</option>
                            <option value="15 Days">{t.fifteenDays}</option>
                            <option value="1 Month">{t.oneMonth}</option>
                            <option value="2 Month">{t.twoMonths}</option>
                            <option value="No Notice Period">{t.noNoticePeriod}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">{t.gateClosingTitle}</label>
                          <input 
                            type="time" 
                            value={gateClosingTime} 
                            onChange={(e) => setGateClosingTime(e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800">{t.servicesTitle}</h3>
                      <div className="space-y-2">
                        {servicesOptions.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`w-full flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                              services.includes(service.id)
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{service.icon}</span>
                              <span className="text-gray-700">{service.label}</span>
                            </span>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              services.includes(service.id) ? 'border-primary bg-primary' : 'border-gray-300'
                            }`}>
                              {services.includes(service.id) && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={foodProvided} 
                            onChange={(e) => setFoodProvided(e.target.checked)} 
                            className="w-5 h-5 text-primary focus:ring-primary rounded" 
                          />
                          <span className="text-gray-700 font-medium">{t.foodProvidedLabel}</span>
                        </label>
                      </div>
                      {foodProvided && (
                        <div className="space-y-3 mt-3 pl-8">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">Meals</label>
                            <div className="grid grid-cols-3 gap-2">
                              {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                                <button
                                  key={meal}
                                  onClick={() => toggleMeal(meal)}
                                  className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${
                                    meals.includes(meal)
                                      ? 'border-primary bg-primary/10 text-primary font-medium'
                                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                  }`}
                                >
                                  {meal === 'Breakfast' ? t.breakfast : meal === 'Lunch' ? t.lunch : t.dinner}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">{t.vegNonVegLabel}</label>
                            <div className="grid grid-cols-2 gap-2">
                              {['Veg', 'Veg & Non Veg'].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => setVegNonVeg(option)}
                                  className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${
                                    vegNonVeg === option
                                      ? 'border-primary bg-primary/10 text-primary font-medium'
                                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                  }`}
                                >
                                  {option === 'Veg' ? t.veg : t.vegAndNonVeg}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">{t.foodChargesLabel}</label>
                            <select 
                              value={foodCharges} 
                              onChange={(e) => setFoodCharges(e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none bg-white cursor-pointer"
                            >
                              <option value="">{t.selectCategoryPlaceholder}</option>
                              <option value="Included in rent">{t.includedInRent}</option>
                              <option value="Per meal Basis">{t.perMealBasis}</option>
                              <option value="Fixed monthly Amount">{t.fixedMonthlyAmount}</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800">{t.commonAreaTitle}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {commonAmenitiesOptions.map((amenity) => (
                          <button
                            key={amenity.id}
                            onClick={() => toggleCommonAmenity(amenity.id)}
                            className={`flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                              commonAmenities.includes(amenity.id)
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{amenity.icon}</span>
                              <span className="text-sm text-gray-700">{amenity.label}</span>
                            </span>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              commonAmenities.includes(amenity.id) ? 'border-primary bg-primary' : 'border-gray-300'
                            }`}>
                              {commonAmenities.includes(amenity.id) && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={parkingAvailable} 
                            onChange={(e) => setParkingAvailable(e.target.checked)} 
                            className="w-5 h-5 text-primary focus:ring-primary rounded" 
                          />
                          <span className="text-gray-700 font-medium">{t.parkingAvailability}</span>
                        </label>
                      </div>
                      {parkingAvailable && (
                        <div className="pl-8">
                          <div className="grid grid-cols-2 gap-2">
                            {['2-Wheeler', 'Car Parking'].map((option) => (
                              <button
                                key={option}
                                onClick={() => setParkingType(option)}
                                className={`py-2 px-3 border-2 rounded-xl transition-all text-sm ${
                                  parkingType === option
                                    ? 'border-primary bg-primary/10 text-primary font-medium'
                                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                }`}
                              >
                                {option === '2-Wheeler' ? t.twoWheeler : t.carParking}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Tenant Pricing & Preferences */}
                {propertyType === "Tenant" && (
                  <>
                    <div className="space-y-4 pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800">{t.priceExpectTitle}</h3>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          {t.monthlyRentLabel}<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-lg">{currencySymbol}</span>
                          <input 
                            type="text" 
                            value={monthlyRentAmount} 
                            onChange={(e) => setMonthlyRentAmount(e.target.value)} 
                            placeholder={t.enterMonthlyRent} 
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-lg" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">{t.securityAmountOptional}</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{currencySymbol}</span>
                          <input 
                            type="text" 
                            value={securityAmount} 
                            onChange={(e) => setSecurityAmount(e.target.value)} 
                            placeholder={t.enterSecurityAmount} 
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">{t.maintenanceChargesOptional}</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{currencySymbol}</span>
                            <input 
                              type="text" 
                              value={maintenanceCharges} 
                              onChange={(e) => setMaintenanceCharges(e.target.value)} 
                              placeholder={t.enterSecurityAmount} 
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                            />
                          </div>
                          <select 
                            value={maintenanceType} 
                            onChange={(e) => setMaintenanceType(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none bg-white cursor-pointer"
                          >
                            <option value="">{t.selectMaintenanceType}</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Yearly">Yearly</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800">{t.statusOfProperty}</h3>
                      <div>
                        <label className="block text-gray-700 font-medium mb-3">{t.availableFrom}</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['Selected Date', 'Immediately'].map((option) => (
                            <button
                              key={option}
                              onClick={() => setAvailableFrom(option)}
                              className={`py-3 px-4 border-2 rounded-xl transition-all ${
                                availableFrom === option
                                  ? 'border-primary bg-primary/10 text-primary font-medium'
                                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {option === 'Selected Date' ? t.selectedDate : t.immediately}
                            </button>
                          ))}
                        </div>
                      </div>
                      {availableFrom === 'Selected Date' && (
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">{t.availableDate}</label>
                          <input 
                            type="date" 
                            value={availableDate} 
                            onChange={(e) => setAvailableDate(e.target.value)} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors" 
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800">{t.additionalDetailsTitle}</h3>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">{t.additionalRooms}</label>
                        <div className="space-y-2">
                          {[
                            { id: 'poojaRoom', label: t.poojaRoom },
                            { id: 'servantRoom', label: t.servantRoom },
                            { id: 'store', label: t.store },
                            { id: 'study', label: t.study }
                          ].map((room) => (
                            <button
                              key={room.id}
                              onClick={() => toggleAdditionalRoom(room.id)}
                              className={`w-full flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                                additionalRooms.includes(room.id)
                                  ? 'border-primary bg-primary/10'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                            >
                              <span className="text-gray-700">{room.label}</span>
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                additionalRooms.includes(room.id) ? 'border-primary bg-primary' : 'border-gray-300'
                              }`}>
                                {additionalRooms.includes(room.id) && <Check className="w-3 h-3 text-white" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">{t.overlookingLabel}</label>
                        <div className="space-y-2">
                          {[
                            { id: 'gardenPark', label: t.gardenPark },
                            { id: 'mainRoad', label: t.mainRoad },
                            { id: 'pool', label: t.pool }
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => toggleOverlooking(item.id)}
                              className={`w-full flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                                overlooking.includes(item.id)
                                  ? 'border-primary bg-primary/10'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                            >
                              <span className="text-gray-700">{item.label}</span>
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                overlooking.includes(item.id) ? 'border-primary bg-primary' : 'border-gray-300'
                              }`}>
                                {overlooking.includes(item.id) && <Check className="w-3 h-3 text-white" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">{t.facingLabel}</label>
                        <div className="grid grid-cols-4 gap-2">
                          {['East', 'North', 'North-East', 'North-West', 'South', 'South-East', 'South-West', 'West'].map((direction) => (
                            <button
                              key={direction}
                              onClick={() => setFacing(direction)}
                              className={`py-2 px-2 border-2 rounded-xl transition-all text-xs ${
                                facing === direction
                                  ? 'border-primary bg-primary/10 text-primary font-medium'
                                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {direction}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">{t.societyAmenitiesLabel}</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            'Maintenance Staff', 'Air Conditioned', 'Outdoor Tennis Courts', 'Banquet Hall',
                            'Park', 'Bar/Lounge', 'Piped Gas', 'Cafeteria/Food Court', 'Power Back Up',
                            'Club House', 'Private Terrace/Garden', 'Conference Room', 'RO Water System',
                            'DTH Television Facility', 'Rain Water Harvesting', 'Gymnasium', 'Reserved Parking',
                            'Intercom Facility', 'Security', 'Internet/Wi-Fi Connectivity', 'Service/Good Lift',
                            'Jogging and Strolling Track', 'Swimming Pool', 'Laundry Service', 'Vaastu Compliant',
                            'Lift', 'Waste Disposal'
                          ].map((amenity) => (
                            <button
                              key={amenity}
                              onClick={() => toggleSocietyAmenity(amenity)}
                              className={`flex items-center justify-between p-2 border-2 rounded-xl transition-all text-xs ${
                                societyAmenities.includes(amenity)
                                  ? 'border-primary bg-primary/10'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                            >
                              <span className="text-gray-700 text-left">{amenity}</span>
                              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ml-1 ${
                                societyAmenities.includes(amenity) ? 'bg-primary' : 'border-2 border-gray-300'
                              }`}>
                                {societyAmenities.includes(amenity) && <Check className="w-2.5 h-2.5 text-white" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">{t.tenantsYouPrefer}</label>
                        <div className="space-y-2">
                          {[
                            { id: 'coupleFamily', label: t.coupleFamily },
                            { id: 'vegetarians', label: t.vegetarians },
                            { id: 'withCompanyLease', label: t.withCompanyLease },
                            { id: 'withoutPets', label: t.withoutPets }
                          ].map((tenant) => (
                            <button
                              key={tenant.id}
                              onClick={() => toggleTenantPrefer(tenant.id)}
                              className={`w-full flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
                                tenantsPrefer.includes(tenant.id)
                                  ? 'border-primary bg-primary/10'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                            >
                              <span className="text-gray-700">{tenant.label}</span>
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                tenantsPrefer.includes(tenant.id) ? 'border-primary bg-primary' : 'border-gray-300'
                              }`}>
                                {tenantsPrefer.includes(tenant.id) && <Check className="w-3 h-3 text-white" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">{t.localityDescriptionLabel}</label>
                        <textarea 
                          value={localityDescription} 
                          onChange={(e) => setLocalityDescription(e.target.value)} 
                          placeholder={t.localityDescriptionPlaceholder} 
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none" 
                        />
                      </div>
                    </div>
                  </>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button 
                  onClick={handleContinueStep3} 
                  className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  {t.continue}
                </button>
              </div>
            )}

            {/* STEP 4: Photos & Description */}
            {step === 4 && (
              <div className="space-y-6">
                <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4">
                  <ArrowLeft className="w-5 h-5" />{t.back}
                </button>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">{t.step4Title}</h2>
                </div>

                {/* USP Section */}
                <div className="space-y-4 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800">{t.writeUSPTitle}</h3>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">{t.selectCategoryLabel}</label>
                    <select 
                      value={uspCategory} 
                      onChange={(e) => setUspCategory(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none bg-white cursor-pointer"
                    >
                      <option value="">{t.selectCategoryPlaceholder}</option>
                      <option value="Food">{t.food}</option>
                      <option value="Locality">{t.locality}</option>
                      <option value="Amenities">{t.amenities}</option>
                      <option value="Others">{t.others}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">{t.writeUSPLabel}</label>
                    <textarea 
                      value={uspText} 
                      onChange={(e) => setUspText(e.target.value)} 
                      placeholder={t.writeUSPPlaceholder} 
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none" 
                    />
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-4 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800">{t.pgDescriptionTitle}</h3>
                  <p className="text-sm text-gray-600">{t.pgDescriptionSubtitle}</p>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">{t.pgDescriptionLabel}</label>
                    <textarea 
                      value={pgDescription} 
                      onChange={(e) => setPgDescription(e.target.value)} 
                      placeholder={t.pgDescriptionPlaceholder} 
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none" 
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => useSampleDescription(t.sampleText)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                    >
                      {t.sample1} - {t.editAndUse}
                    </button>
                    <button
                      onClick={() => useSampleDescription(t.sampleText)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                    >
                      {t.sample2} - {t.editAndUse}
                    </button>
                  </div>
                </div>

                {/* Upload Pictures */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800">{t.uploadPicturesTitle}</h3>
                  <p className="text-sm text-gray-600">{t.uploadSubtitle}</p>
                  <p className="text-xs text-gray-500">{t.uploadInfo}</p>
                  
                  {propertyType === "PG" ? (
                    // PG Property Image Upload
                    <div className="space-y-6">
                      {/* Rooms Images */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-md font-semibold text-gray-800">{t.roomsImages}</h4>
                            <p className="text-xs text-gray-500">{t.roomsImagesSubtitle}</p>
                          </div>
                          <button
                            type="button"
                            onClick={addRoomImage}
                            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            + {t.addRoom}
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {roomImages.map((room) => (
                            <div key={room.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* Room Name */}
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {t.roomName}
                                  </label>
                                  <input
                                    type="text"
                                    value={room.name}
                                    onChange={(e) => updateRoomImage(room.id, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    placeholder="e.g., Room 1"
                                  />
                                </div>
                                
                                {/* Room Status */}
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {t.roomStatus}
                                  </label>
                                  <select
                                    value={room.status}
                                    onChange={(e) => updateRoomImage(room.id, 'status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                  >
                                    <option value="vacant">{t.vacant}</option>
                                    <option value="occupied">{t.occupied}</option>
                                  </select>
                                </div>
                                
                                {/* Upload Image */}
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {t.uploadRoomImage}
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="file"
                                      id={`room-${room.id}`}
                                      accept="image/*"
                                      onChange={(e) => handleRoomImageUpload(room.id, e.target.files?.[0] || null)}
                                      className="hidden"
                                    />
                                    <label
                                      htmlFor={`room-${room.id}`}
                                      className={`flex-1 px-3 py-2 text-center text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                                        room.file 
                                          ? 'bg-green-100 text-green-700 border border-green-300' 
                                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                      }`}
                                    >
                                      {room.file ? '✓ Uploaded' : 'Choose File'}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeRoomImage(room.id)}
                                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Preview Image */}
                              {room.file && (
                                <div className="relative h-32 rounded-lg overflow-hidden">
                                  <img
                                    src={URL.createObjectURL(room.file)}
                                    alt={room.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                    room.status === 'vacant' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                  }`}>
                                    {room.status === 'vacant' ? t.vacant : t.occupied}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {roomImages.length === 0 && (
                            <div className="text-center py-8 text-gray-500 text-sm">
                              No rooms added yet. Click "Add Room" to start.
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Kitchen Images */}
                      <div className="space-y-3">
                        <h4 className="text-md font-semibold text-gray-800">{t.kitchenImages}</h4>
                        <div className="relative">
                          <input
                            type="file"
                            id="kitchen-images"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleKitchenImageUpload(e.target.files)}
                            className="hidden"
                          />
                          <label
                            htmlFor="kitchen-images"
                            className="flex flex-col items-center justify-center h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{t.uploadImages}</span>
                            {kitchenImages.length > 0 && (
                              <span className="text-xs text-green-600 mt-1">{kitchenImages.length} {t.imagesUploaded}</span>
                            )}
                          </label>
                        </div>
                        {kitchenImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {kitchenImages.map((file, index) => (
                              <div key={index} className="relative h-24 rounded-lg overflow-hidden group">
                                <img src={URL.createObjectURL(file)} alt={`Kitchen ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setKitchenImages(prev => prev.filter((_, i) => i !== index))}
                                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Washroom Images */}
                      <div className="space-y-3">
                        <h4 className="text-md font-semibold text-gray-800">{t.washroomImages}</h4>
                        <div className="relative">
                          <input
                            type="file"
                            id="washroom-images"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleWashroomImageUpload(e.target.files)}
                            className="hidden"
                          />
                          <label
                            htmlFor="washroom-images"
                            className="flex flex-col items-center justify-center h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{t.uploadImages}</span>
                            {washroomImages.length > 0 && (
                              <span className="text-xs text-green-600 mt-1">{washroomImages.length} {t.imagesUploaded}</span>
                            )}
                          </label>
                        </div>
                        {washroomImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {washroomImages.map((file, index) => (
                              <div key={index} className="relative h-24 rounded-lg overflow-hidden group">
                                <img src={URL.createObjectURL(file)} alt={`Washroom ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setWashroomImages(prev => prev.filter((_, i) => i !== index))}
                                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Common Area Images */}
                      <div className="space-y-3">
                        <h4 className="text-md font-semibold text-gray-800">{t.commonAreaImages}</h4>
                        <div className="relative">
                          <input
                            type="file"
                            id="common-area-images"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleCommonAreaImageUpload(e.target.files)}
                            className="hidden"
                          />
                          <label
                            htmlFor="common-area-images"
                            className="flex flex-col items-center justify-center h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{t.uploadImages}</span>
                            {commonAreaImages.length > 0 && (
                              <span className="text-xs text-green-600 mt-1">{commonAreaImages.length} {t.imagesUploaded}</span>
                            )}
                          </label>
                        </div>
                        {commonAreaImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {commonAreaImages.map((file, index) => (
                              <div key={index} className="relative h-24 rounded-lg overflow-hidden group">
                                <img src={URL.createObjectURL(file)} alt={`Common Area ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setCommonAreaImages(prev => prev.filter((_, i) => i !== index))}
                                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Tenant Property Image Upload - New Structure
                    <div className="space-y-6">
                      {/* Room Images */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-md font-semibold text-gray-800">{t.tenantRoomsImages}</h4>
                            <p className="text-xs text-gray-500">{t.tenantRoomsImagesSubtitle}</p>
                          </div>
                          <button
                            type="button"
                            onClick={addTenantRoomImage}
                            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            + {t.addRoom}
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {tenantRoomImages.map((room) => (
                            <div key={room.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Room Name */}
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {t.roomName}
                                  </label>
                                  <input
                                    type="text"
                                    value={room.name}
                                    onChange={(e) => updateTenantRoomImage(room.id, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    placeholder="e.g., Master Bedroom, Living Room"
                                  />
                                </div>
                                
                                {/* Upload Image */}
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {t.uploadRoomImage}
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="file"
                                      id={`tenant-room-${room.id}`}
                                      accept="image/*"
                                      onChange={(e) => handleTenantRoomImageUpload(room.id, e.target.files?.[0] || null)}
                                      className="hidden"
                                    />
                                    <label
                                      htmlFor={`tenant-room-${room.id}`}
                                      className={`flex-1 px-3 py-2 text-center text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                                        room.file 
                                          ? 'bg-green-100 text-green-700 border border-green-300' 
                                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                      }`}
                                    >
                                      {room.file ? '✓ Uploaded' : 'Choose File'}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeTenantRoomImage(room.id)}
                                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Preview Image */}
                              {room.file && (
                                <div className="relative h-32 rounded-lg overflow-hidden">
                                  <img
                                    src={URL.createObjectURL(room.file)}
                                    alt={room.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute bottom-2 left-2 px-3 py-1 rounded-lg bg-primary/90 text-white text-xs font-semibold">
                                    {room.name}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {tenantRoomImages.length === 0 && (
                            <div className="text-center py-8 text-gray-500 text-sm">
                              No rooms added yet. Click "Add Room" to start.
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Kitchen Images */}
                      <div className="space-y-3">
                        <h4 className="text-md font-semibold text-gray-800">{t.kitchenImages}</h4>
                        <div className="relative">
                          <input
                            type="file"
                            id="tenant-kitchen-images"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleTenantKitchenImageUpload(e.target.files)}
                            className="hidden"
                          />
                          <label
                            htmlFor="tenant-kitchen-images"
                            className="flex flex-col items-center justify-center h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{t.uploadImages}</span>
                            {tenantKitchenImages.length > 0 && (
                              <span className="text-xs text-green-600 mt-1">{tenantKitchenImages.length} {t.imagesUploaded}</span>
                            )}
                          </label>
                        </div>
                        {tenantKitchenImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {tenantKitchenImages.map((file, index) => (
                              <div key={index} className="relative h-24 rounded-lg overflow-hidden group">
                                <img src={URL.createObjectURL(file)} alt={`Kitchen ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setTenantKitchenImages(prev => prev.filter((_, i) => i !== index))}
                                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Washroom Images */}
                      <div className="space-y-3">
                        <h4 className="text-md font-semibold text-gray-800">{t.washroomImages}</h4>
                        <div className="relative">
                          <input
                            type="file"
                            id="tenant-washroom-images"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleTenantWashroomImageUpload(e.target.files)}
                            className="hidden"
                          />
                          <label
                            htmlFor="tenant-washroom-images"
                            className="flex flex-col items-center justify-center h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{t.uploadImages}</span>
                            {tenantWashroomImages.length > 0 && (
                              <span className="text-xs text-green-600 mt-1">{tenantWashroomImages.length} {t.imagesUploaded}</span>
                            )}
                          </label>
                        </div>
                        {tenantWashroomImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {tenantWashroomImages.map((file, index) => (
                              <div key={index} className="relative h-24 rounded-lg overflow-hidden group">
                                <img src={URL.createObjectURL(file)} alt={`Washroom ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setTenantWashroomImages(prev => prev.filter((_, i) => i !== index))}
                                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Common Area Images */}
                      <div className="space-y-3">
                        <h4 className="text-md font-semibold text-gray-800">{t.commonAreaImages}</h4>
                        <div className="relative">
                          <input
                            type="file"
                            id="tenant-common-area-images"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleTenantCommonAreaImageUpload(e.target.files)}
                            className="hidden"
                          />
                          <label
                            htmlFor="tenant-common-area-images"
                            className="flex flex-col items-center justify-center h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{t.uploadImages}</span>
                            {tenantCommonAreaImages.length > 0 && (
                              <span className="text-xs text-green-600 mt-1">{tenantCommonAreaImages.length} {t.imagesUploaded}</span>
                            )}
                          </label>
                        </div>
                        {tenantCommonAreaImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {tenantCommonAreaImages.map((file, index) => (
                              <div key={index} className="relative h-24 rounded-lg overflow-hidden group">
                                <img src={URL.createObjectURL(file)} alt={`Common Area ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setTenantCommonAreaImages(prev => prev.filter((_, i) => i !== index))}
                                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* 360° Virtual Tour */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-md font-semibold text-gray-800">{t.view360Section}</h4>
                          <p className="text-xs text-gray-500">{t.view360Subtitle}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            {t.view360Label}
                          </label>
                          <input
                            type="url"
                            value={view360Url}
                            onChange={(e) => setView360Url(e.target.value)}
                            placeholder={t.view360Placeholder}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                          />
                          {view360Url && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                              <Check className="w-4 h-4" />
                              <span>360° view link added</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button 
                  onClick={handleContinueStep4} 
                  className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  {t.continue}
                </button>
              </div>
            )}

            {/* STEP 5: Success */}
            {step === 5 && (
              <div className="flex flex-col items-center justify-center space-y-8 py-12">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center animate-bounce">
                  <Check className="w-16 h-16 text-primary" />
                </div>
                <div className="text-center space-y-3">
                  <h2 className="text-3xl md:text-4xl font-bold text-primary">{t.congratulations}</h2>
                  <p className="text-xl text-gray-600">{t.propertyPosted}</p>
                  <p className="text-sm text-gray-500 mt-4">Redirecting to home page...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
