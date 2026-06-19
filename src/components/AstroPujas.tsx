import React, { useState } from "react";
import { Sparkles, Compass, Shield, Users, Search, Calendar, Check, Send } from "lucide-react";

interface PujaItem {
  id: string;
  category: "Life Success" | "Grah Shanti" | "Nakshatra Dosh" | "Kundali Dosh";
  title: string;
  marathiTitle: string;
  description: string;
  benefits: string[];
  materialsNeeded: string[];
}

export default function AstroPujas() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPuja, setSelectedPuja] = useState<PujaItem | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const categories = [
    { value: "All", label: "सर्व पूजा (All)" },
    { value: "Life Success", label: "यश व सुख समृद्धी (Life Success)" },
    { value: "Grah Shanti", label: "ग्रह शांती (Grah Shanti)" },
    { value: "Nakshatra Dosh", label: "नक्षत्र दोष निवारण (Nakshatra Dosh)" },
    { value: "Kundali Dosh", label: "कुंडली दोष शांती (Kundali Dosh)" }
  ];

  const pujas: PujaItem[] = [
    // 1. Puja For Life Success
    {
      id: "p-peace",
      category: "Life Success",
      title: "Puja for Peace",
      marathiTitle: "शांतता आणि सुख-समृद्धी पूजा",
      description: "घरातील कलह, मानसिक तणाव आणि नकारात्मकता दूर करून कौटुंबिक सौख्य व मनःशांती प्रस्थापित करण्यासाठी ही पूजा अत्यंत प्रभावी मानली जाते. घरातील वास्तुदोष व मानसिक क्लेश कमी होण्यास मदत होते.",
      benefits: ["कौटुंबिक सुख आणि सलोख्यामध्ये वाढ", "मानसिक तणाव व निरर्थक चिंतेतून मुक्तता", "वास्तूमध्ये सकारात्मक ऊर्जेचा संचार"],
      materialsNeeded: ["हळद-कुंकू", "अक्षता", "कलश", "नारळ", "तुळशीची पाने"]
    },
    {
      id: "p-birthday",
      category: "Life Success",
      title: "Birthday Puja",
      marathiTitle: "आयुष्यवर्धक वाढदिवस संकल्प पूजा",
      description: "वाढदिवसाच्या शुभ दिवशी ईश्वराचे आशीर्वाद मिळवण्यासाठी, दीर्घायुष्य आणि उत्तम आरोग्यासाठी ही विशेष पूजा केली जाते. यात आयुष्य सूक्ताचे पठण करून कुलदेवतेचा विशेष आशीर्वाद घेतला जातो.",
      benefits: ["दीर्घायुष्य आणि बलशाली आरोग्य प्राप्ती", "नवीन वर्षातील आव्हानांवर मात करण्याचे बळ", "वर्षभर ईश्वरी सुरक्षा चक्र लाभणे"],
      materialsNeeded: ["पंचामृत", "दुर्वा", "गणपतीचे आवडते मोदक", "गुलाल", "फुलांचे हार"]
    },
    {
      id: "p-wealth",
      category: "Life Success",
      title: "Puja for Wealth",
      marathiTitle: "अष्टलक्ष्मी धनवृद्धी पूजा",
      description: "व्यापार, नोकरीत वाढ मिळवून देण्यासाठी आणि घरात लक्ष्मीचा अखंड वास राहण्यासाठी ही पूजा केली जाते. कुबेर यंत्र आणि लक्ष्मी महामंत्रांच्या उच्चाराने धन मार्ग सुकर होतात.",
      benefits: ["अडकलेले व प्रलंबित धन परत मिळणे", "नवीन नोकरी आणि व्यावसायिक संधी निर्माण होतात", "कर्जमुक्तीसाठी विशेष मार्ग प्राप्त होणे"],
      materialsNeeded: ["कमळ गट्टा माळ", "सुपारी", "अष्टगंध", "कवडी", "शुद्ध तूप व मधाचे भांडे"]
    },
    {
      id: "p-health",
      category: "Life Success",
      title: "Puja for Health",
      marathiTitle: "आरोग्यदायिनी धन्वंतरी पूजा",
      description: "दीर्घ आजारपण, शारीरिक व्याधी आणि कमकुवत मानसिक स्थिती दूर करण्यासाठी भगवान धन्वंतरी आणि महामृत्युंजय मंत्रांच्या संकल्पाने ही आरोग्यदायी पूजा केली जाते.",
      benefits: ["शारीरिक व्याधी व जुनाट आजारांपासून उपशमन", "प्रतिकारशक्ती आणि शारीरिक ऊर्जेची वृद्धी", "वैद्यकीय उपचारांना जलद यश मिळणे"],
      materialsNeeded: ["तुळशी मंजिरी", "समिधा", "हवन कुंड", "गंगाजल", "ऋतू फळे"]
    },
    {
      id: "p-marriage",
      category: "Life Success",
      title: "Puja for Marriage",
      marathiTitle: "शीघ्र विवाह आणि कात्यायनी पूजा",
      description: "विवाहामध्ये येणारे विविध अडथळे, विलंब आणि विवाहाची सुयोग्य स्थळे न मिळणे या अडचणींवर मात करण्यासाठी ही अत्यंत सिद्ध व शीघ्र फलदायी माता कात्यायनीची पूजा केली जाते.",
      benefits: ["विवाह ठरण्यातील अडथळे दूर होतात", "मनपसंत आणि सुयोग्य जीवनसाथीची प्राप्ती", "विवाहोत्तर सुखी वैवाहिक जीवनाची पायाभरणी"],
      materialsNeeded: ["देवीची सुवर्ण किंवा तांब्याची प्रतिमा", "लाल साडी किंवा वस्त्र", "हळकुंड", "मंगळसूत्र", "कुंकू"]
    },
    {
      id: "p-newyear2027",
      category: "Life Success",
      title: "New Year Puja 2027",
      marathiTitle: "नवीन वर्ष २०२७ नवसंकल्प सिद्धी पूजा",
      description: "सन २०२७ हे नवीन वर्ष आपल्यासाठी आणि आपल्या संपूर्ण कुटुंबासाठी प्रगतीचे, आरोग्याचे आणि आनंदाचे जावे यासाठी वर्षाच्या सुरुवातीला केली जाणारी कल्याणकारी सामूहिक व वैयक्तिक पूजा.",
      benefits: ["वर्ष २०२७ मधील यशाचा मार्ग सुकर होणे", "अपेक्षित संकल्प वेळेत पूर्ण होणे", "वर्षभर सर्व ग्रहांची अनुकूलता आणि शुभ आशीर्वाद"],
      materialsNeeded: ["पंचरंगी दोरा", "गु़ळ-खोबरे", "पाच प्रकारची फळे", "कलश", "तांब्या भुईमूग"]
    },

    // 2. Puja For Grah Shanti
    {
      id: "p-navgrah",
      category: "Grah Shanti",
      title: "Navgrah (9 Planets) Puja",
      marathiTitle: "सर्व नवग्रह शांतता महापूजा",
      description: "सूर्य, चंद्र, मंगळ, बुध, गुरु, शुक्र, शनी, राहू आणि केतू या सर्व नऊ ग्रहांचे संतुलन करण्यासाठी व त्यांचे अशुभ प्रभाव नष्ट करून शुभ परिणाम मिळवण्यासाठी केली जाणारी मुख्य वैदिक पूजा.",
      benefits: ["सर्व नऊ ग्रहांचे संतुलन आणि कुंडलीतील नकारात्मक योग शांत करणे", "अचानक येणाऱ्या संकटांपासून कौटुंबिक संरक्षण", "करिअर आणि आरोग्यात येणाऱ्या चढ-उतारांवर नियंत्रण"],
      materialsNeeded: ["नवधान्य (नऊ प्रकारची धान्ये)", "नऊ रंगांची वस्त्रे", "नवग्रह समिधा", "हवन सामग्री"]
    },
    {
      id: "p-surya",
      category: "Grah Shanti",
      title: "Surya Puja",
      marathiTitle: "सूर्य ग्रह पीडा शांती पूजा",
      description: "पितृदोष निवारण, समाजात मान-सन्मान मिळवणे, सरकारी कामात अडथळे दूर करणे आणि आत्मविश्वास वाढवण्यासाठी सूर्यदेवाची विशेष वैदिक मंत्रोच्चारांसह पूजा केली जाते.",
      benefits: ["समाजात मान-प्रतिष्ठा आणि सरकारी कामात यश", "डोळे आणि हाडांशी संबंधित आजारांमध्ये सुधारणा", "आत्मविश्वास आणि नेतृत्त्व गुणांची प्रभावी वाढ"],
      materialsNeeded: ["तांब्याचे ताट", "लाल फुले", "लाल चंदन", "केसर", "गहू"]
    },
    {
      id: "p-chandra",
      category: "Grah Shanti",
      title: "Chandra Puja",
      marathiTitle: "चंद्र ग्रह शांती आणि मनःशुद्धी पूजा",
      description: "मानसिक अशांती, नैराश्य, भीती आणि आईशी संबंध सुधारण्यासाठी चंद्र देवाची शांतता पूजा. याने मनाला स्थिरता लाभते आणि कल्पनाशक्ती मजबूत होते.",
      benefits: ["मनाची चंचलता कमी होऊन ध्यान व अभ्यासात लक्ष लागणे", "उत्तम व गाढ झोप मिळणे", "आईच्या आरोग्यामध्ये प्रगती होणे"],
      materialsNeeded: ["पांढरे वस्त्र", "तांदूळ", "पांढरी फुले", "कपूर (कापूर)", "दूध"]
    },
    {
      id: "p-mangal",
      category: "Grah Shanti",
      title: "Mangal Puja",
      marathiTitle: "मंगळ ग्रह आणि अंगारक शांती पूजा",
      description: "मंगळ दोषाचे निवारण करण्यासाठी, अतिरिक्त क्रोध कमी करण्यासाठी, कोर्टकचेरीच्या प्रकरणांमध्ये यश मिळवण्यासाठी आणि भूमी खरेदीच्या व्यवहारांना गती देण्यासाठी ही पूजा विहित आहे.",
      benefits: ["मांगलिक दोषाचा तीव्र प्रभाव शांत होणे", "अवाजवी राग व आक्रमकपणावर नियंत्रण मिळणे", "भांडण-तंटे आणि अपघातांपासून बचाव"],
      materialsNeeded: ["मसुराची डाळ", "लाल वस्त्र", "गूळ", "खायची विड्याची पाने", "रक्तचंदन"]
    },
    {
      id: "p-budh",
      category: "Grah Shanti",
      title: "Budh Puja",
      marathiTitle: "बुध ग्रह शांती आणि बुद्धीवर्धन पूजा",
      description: "व्यापारात प्रगती, गणितात प्राविण्य, उत्कृष्ट संवाद कौशल्य आणि अभ्यासात एकाग्रता मिळवण्यासाठी बुध ग्रहासाठी विशेष हरित पूजा केली जाते.",
      benefits: ["व्यापारात ग्राहक संख्या आणि आर्थिक नफा वाढणे", "बोलण्यात गोडवा व प्रभावी वक्तृत्व प्राप्त होणे", "त्वचेचे विकार आणि मज्जासंस्थेचे आजार बरे होण्यास चालना"],
      materialsNeeded: ["मूग डाळ", "हिरवे वस्त्र", "तुळशीची पाने", "दुर्वांची जुडी", "झाडाची पाने"]
    },
    {
      id: "p-brihaspati",
      category: "Grah Shanti",
      title: "Brihaspati Puja",
      marathiTitle: "देवगुरु बृहस्पती (गुरु) शांती अनुकूलता पूजा",
      description: "उच्च शिक्षण, संतती सुख, भाग्य वृद्धी आणि आध्यात्मिक यश मिळवण्यासाठी देवगुरु बृहस्पतींची पिवळ्या फुलांनी आणि वैदिक जपाने पूजा केली जाते.",
      benefits: ["ज्ञानात भरघोस वाढ आणि उच्च शिक्षण परीक्षांमध्ये यश", "पुत्र-पुत्री सुख व त्यांच्या करिअरमध्ये प्रगती", "भाग्याची भक्कम साथ लाभून कठीण काळ सुकर होणे"],
      materialsNeeded: ["चण्याची डाळ", "हळद", "पिवळी फुले", "केळीचे पान", "सोनेरी धागा"]
    },
    {
      id: "p-shukra",
      category: "Grah Shanti",
      title: "Shukra Puja",
      marathiTitle: "शुक्र ग्रह सुख-सौंदर्य आणि विलास पूजा",
      description: "वैवाहिक सुख, प्रेमसंबंध, ऐषारामी वस्तूंचा उपभोग, कला आणि सौंदर्याच्या क्षेत्रातील यशासाठी शुक्र देवाची विशेष पांढऱ्या वस्तूंच्या साहाय्याने पूजा केली जाते.",
      benefits: ["वैवाहिक जोडीदारासोबतचे संबंध मधुर व प्रेमळ बनणे", "आलिशान वाहन, घर खरेदीचे स्वप्न पूर्ण होणे", "कला, अभिनय किंवा डिझाईन कारकिर्दीत मोठी यश प्राप्ती"],
      materialsNeeded: ["साखर", "पांढरे सुगंधी अत्तर", "पांढरी फुले", "तांदूळ", "दही"]
    },
    {
      id: "p-shani",
      category: "Grah Shanti",
      title: "Shani Puja",
      marathiTitle: "शनैश्चर सूर्यपुत्र शनि शांत आणि साडेसाती निवारण पूजा",
      description: "साडेसातीचा त्रास कमी करण्यासाठी, कष्टांचे चीज होण्यासाठी, जुनाट आजार बरे करण्यासाठी आणि आकस्मिक अपयश टाळण्यासाठी न्यायदेवता शनिराजांची विशेष तैलाभिषेक पूजा.",
      benefits: ["साडेसाती, ढय्या आणि महादशेतील अडथळे दूर होणे", "कष्टांचे योग्य मोबदले व कामात स्थिरता मिळणे", "शत्रूंपासून संपूर्ण संरक्षण मिळणे"],
      materialsNeeded: ["काळे तीळ", "मोहरीचे तेल", "लोखंडी खिळा", "उडीद डाळ", "निळी फुले"]
    },
    {
      id: "p-rahu",
      category: "Grah Shanti",
      title: "Rahu Puja",
      marathiTitle: "राहू ग्रह युती दोष शांतता पूजा",
      description: "अचानक उद्भविणाऱ्या संभ्रमावस्थेतून सुटका करण्यासाठी, परदेश प्रवासाच्या मार्गातील अडचणी दूर करण्यासाठी आणि भ्रम नष्ट करण्यासाठी राहू ग्रहाची विशेष शांती पूजा.",
      benefits: ["मानसिक गोंधळ व चुकीचे निर्णय घेण्याची प्रवृत्ती थांबणे", "अचानक उद्भवणारे अपघात व नुकसान टळणे", "परकीय भूमीवर व्यावसायिक स्थिरता लाभणे"],
      materialsNeeded: ["मोहरी", "नारळ", "काळा धागा", "सत्तेचाली", "कापूर"]
    },
    {
      id: "p-ketu",
      category: "Grah Shanti",
      title: "Ketu Puja",
      marathiTitle: "केतु ग्रह दोष मोक्ष आणि अंतर्ज्ञान पूजा",
      description: "विनाकारण होणारी भीती, गूढ आजार, आध्यात्मिक प्रगती रोखणारे अडथळे आणि कौटुंबिक वाद मिटवण्यासाठी केतुदेवाची केळीची पाने व काळ्या वस्तू वापरून केली जाणारी शांतता विधी पूजा.",
      benefits: ["अध्यात्मिक ज्ञान आणि ध्यान शक्तीची प्राप्ती", "गूढ त्वचेचे आजार आणि संसर्गजन्य रोगांपासून मुक्ती", "कौटुंबिक गैरसमज व वादविवाद संपूर्ण संपुष्टात येणे"],
      materialsNeeded: ["कुशा", "तीळ", "धुपेचे लाकूड", "पाच रंगांची फुले"]
    },

    // 3. Puja For Nakshatra Dosh
    {
      id: "p-nak-gen",
      category: "Nakshatra Dosh",
      title: "Nakshatra Dosh Shanti Puja",
      marathiTitle: "सर्व सर्वसाधारण नक्षत्र दोष शांती पूजा",
      description: "जन्मनक्षत्र प्रतिकूल असल्यास किंवा जन्म अशोभनीय नक्षत्रात झाला असल्यास बालकाच्या व पालकांच्या संरक्षणासाठी जन्माच्या २७ व्या नक्षत्र पुनरावृत्ती वेळी ही विशेष शांती केली जाते.",
      benefits: ["जन्मनक्षत्राचा मनुष्यावर होणारा जीवनभराचा वाईट प्रभाव नष्ट होतो", "अभ्यास, आरोग्य आणि स्वभावात लक्षणीय सकारात्कता येते", "बालपणाचे सर्व बाळंत दोष आणि नजर दोष नाहीसे होतात"],
      materialsNeeded: ["२७ विहिरींचे पाणी किंवा नदीचे पाणी", "२७ झाडांची पाने", "जन्मनक्षत्र मंत्र हवन सामग्री", "कलश"]
    },
    {
      id: "p-nak-ashwini",
      category: "Nakshatra Dosh",
      title: "Ashwini Nakshtra Shanti Puja",
      marathiTitle: "अश्विनी नक्षत्र गंडमूल दोष शांती पूजा",
      description: "अश्विनी नक्षत्राच्या पहिल्या चरणात जन्म झाल्यास पित्याला व बालकाला शारीरिक व मानसिक कष्टाचा सामना करावा लागू शकतो. त्याच्या शांतीसाठी अश्विनी देवतेची विधीवत पूजा सिद्ध केली जाते.",
      benefits: ["पित्यावरील सर्व संकटे आणि आरोग्याचे प्रश्न सुटतात", "बालकाला तीक्ष्ण बुद्धिमत्ता व निरोगी आयुष्य मिळते", "अविचाराने होणारे नुकसान टळते"],
      materialsNeeded: ["तूप", "मध", "अश्विनी कुमार देवतांचे यंत्र", "सुपारी", "पिवळी मोहरी"]
    },
    {
      id: "p-nak-ashlesha",
      category: "Nakshatra Dosh",
      title: "Ashlesha Nakshtra Shanti Puja",
      marathiTitle: "अश्लेषा नक्षत्र (सर्प दोष) शांती पूजा",
      description: "अश्लेषा नक्षत्रातील जन्म अतिशय दाहक आणि मानसिक अस्थिरता निर्माण करू शकतो. यामुळे नातेसंबंधांमध्ये विष पसरण्याची भीती असते. या साठी नागदेवतेची विशेष पूजा व हवन केले जाते.",
      benefits: ["मानसिक जळजळ आणि मत्सर वृत्ती नाहीशी होते", "नातेवाईक आणि भावंडांसोबतचे संबंध सुधारतात", "विष आणि सर्पभयापासून संपूर्ण संरक्षण लाभते"],
      materialsNeeded: ["दूध", "रुईची फुले", "नागदेवतेची प्रतिमा", "चंदन आणि गुग्गुळ धूप"]
    },
    {
      id: "p-nak-magha",
      category: "Nakshatra Dosh",
      title: "Magha Nakshtra Shanti Puja",
      marathiTitle: "मघा नक्षत्र पितृदोष शांती पूजा",
      description: "मघा नक्षत्राचे अधिपती पितर देव मानले जातात. गंडमुळात मोडणाऱ्या या नक्षत्राची शांती केल्याने पूर्वजांचे आशीर्वाद प्राप्त होतात आणि घराण्याची वंशवृद्धी विनाअडथळा होते.",
      benefits: ["पितृदोषाचे घरातून समूळ उच्चाटन", "घराण्यात वंशाला यश आणि संतती लाभणे", " वडिलोपार्जित संपत्तीचे वाद सुटणे"],
      materialsNeeded: ["पितृ तर्पण साहित्य", "काळे तीळ", " दर्भाचे आसन", "खीर नैवेद्य"]
    },
    {
      id: "p-nak-jyestha",
      category: "Nakshatra Dosh",
      title: "Jyestha Nakshtra Shanti Puja",
      marathiTitle: "ज्येष्ठा नक्षत्र ज्येष्ठ बंधू दोष शांती पूजा",
      description: "ज्येष्ठा नक्षत्रात झालेला जन्म मुलाच्या ज्येष्ठ भावंडांसाठी काही काळ हानिकारक मानला जाऊ शकतो. इंद्राची आराधना करून ज्येष्ठ नक्षत्राची शांतता केली जाते जेणेकरून घराण्याचे वर्चस्व व तेज शाबूत राहील.",
      benefits: ["मोठ्या भावंडांवरील संकटे आणि आर्थिक नुकसान टळते", "बालकाला उच्च अधिकाराची पदे आणि अमाप यश मिळते", "मनाची एकाग्रता वाढून निर्णयक्षमता प्रभावी होते"],
      materialsNeeded: ["इंद्र यंत्र", "पांढरी फुले", "पंचामृत", "यव (जव)", "कमळ गट्टा"]
    },
    {
      id: "p-nak-moola",
      category: "Nakshatra Dosh",
      title: "Moola Nakshtra Shanti Puja",
      marathiTitle: "मूळ नक्षत्र (मूळ शांती) महापूजा",
      description: "नक्षत्रांमधील सर्वात प्रखर मानल्या जाणाऱ्या 'मूळ' नक्षत्राची शांती ही अत्यंत महत्त्वाची आहे. कुटुंबाचा नाश, पित्याला बाधा आणि संपत्तीचे नुकसान यांसारखे विपरीत परिणाम टाळण्यासाठी ही शांतता सर्व विधींसह केली जाते्.",
      benefits: ["घरातील कर्ता पुरुष आणि संपत्तीचे रक्षण होते", "अचानक येणारा मोठा अपव्यय व गरिबी टळते", "आयुष्यात अध्यात्मिक आणि भौतिक कमालीचे यश प्राप्त होते"],
      materialsNeeded: ["शंभर पानांचे पाणी", "शंभर औषधी वनस्पती", "रुद्राभिषेक साहित्य", "काळा आणि पांढरा दोरा"]
    },
    {
      id: "p-nak-revati",
      category: "Nakshatra Dosh",
      title: "Revati Nakshtra Shanti Puja",
      marathiTitle: "रेवती नक्षत्र गंडमूल शांती पूजा",
      description: "गंडमुळ नक्षत्रातील शेवटचे नक्षत्र असलेल्या रेवती नक्षत्राची शांती पूषण देवतेची उपासना करून केली जाते, ज्यामुळे व्यवसायातील मोठे तोटे व मानसिक भिती दूर होते.",
      benefits: ["व्यापारी निर्णय अचूक होऊन नफा वाढतो", "मानसिक भिती, अनाकलनीय स्वप्ने पडणे बंद होते", "प्रवास फायदेशीर आणि सुरक्षित ठरतो"],
      materialsNeeded: ["पांढरी वस्त्रे", "दूध आणि मध", "पूषण यंत्र", "केळीची फळे"]
    },

    // 4. Puja For Kundali Dosh
    {
      id: "p-dos-pitra",
      category: "Kundali Dosh",
      title: "Pitra Dosh Puja",
      marathiTitle: "नारायण नागबळी आणि पितृदोष निवारण पूजा",
      description: "कुंडलीतील अत्यंत गंभीर मानल्या जाणाऱ्या 'पितृदोषा'मुळे संतती प्राप्तीत अडथळा, घरामध्ये वारंवार गंभीर आजारपण आणि प्रगती खुंटणे हे परिणाम होतात. यासाठी त्र्यंबकेश्वर किंवा नदीकाठी ही पूजा सर्वोत्तम मानली जाते.",
      benefits: ["घरातील नैराश्य कमी होऊन संतती सुखाचे नवीन मार्ग उघडतात", "नोकरी आणि व्यवसायात अचानक मिळणारी प्रगती", "सर्व प्रकारच्या जुन्या कर्जांमधून मुक्ती मिळणे"],
      materialsNeeded: ["कावळा व गाईला दिला जाणारा विशेष नैवेद्य", "काळे तीळ", "सर्व गंध द्रव्ये", "धार्मिक विधी वस्त्रे"]
    },
    {
      id: "p-dos-kaalsarp",
      category: "Kundali Dosh",
      title: "Kaalsarp Dosh Nivaran Puja",
      marathiTitle: "कालसर्प दोष महाविधी आणि नागबळी पूजा",
      description: "राहू आणि केतू यांच्या कचाट्यात सर्व ग्रह आल्याने कुंडलीत कालसर्प योग निर्माण होतो. यामुळे अपार कष्ट करूनही यश मिळत नाही. भगवान शिव आणि नागराज यांची आराधना करून यात विशेष विधी केला जातो.",
      benefits: ["कष्टाचे तात्काळ फळ मिळून नोकरीत पदोन्नती लाभते", "आरोग्यातील विचित्र व अनाकलनीय जुने आजार नाहीसे होतात", "सर्व प्रकारच्या आकस्मिक संकटांपासून कौटुंबिक विजय"],
      materialsNeeded: ["तांब्याची किंवा चांदीची नाग-नागीण जोडी", "रुद्राभिषेक साहित्य", "दूध", "काळे कापड", "भांग"]
    },
    {
      id: "p-dos-kemdrum",
      category: "Kundali Dosh",
      title: "Kemdrum Yog Dosh Puja",
      marathiTitle: "केमद्रुम योग (दारिद्र्य निवारण) शांती पूजा",
      description: "चंद्राच्या पुढे आणि मागे कोणतेही ग्रह नसल्याने कुंडलीत अत्यंत क्लेशदायक केमद्रुम योग तयार होतो, ज्यामुळे व्यक्ती अत्यंत श्रीमंत घरात जन्म घेऊनही दारिद्र्य किंवा मानसिक एकटेपणा अनुभवते. यासाठी चंद्राची व लक्ष्मीची विशेष पूजा केली जाते.",
      benefits: ["आर्थिक संकटांमधून कायमची सुटका होते", "मानसिक एकाकीपणा आणि नैराश्यात प्रचंड सुधारणा", "कामात योग्य संधी मिळून प्रगतीची दारे उघडतात"],
      materialsNeeded: ["चांदीचे नाणे", "तांदूळ अर्पण विधी", "सुगंधी धूप आणि पांढरी मिठाई"]
    },
    {
      id: "p-dos-gandmool",
      category: "Kundali Dosh",
      title: "Gandmool Nakshatra Shanti Puja",
      marathiTitle: "गंडमूळ नक्षत्र शांती महापूजा",
      description: "गंड आणि मूळ नक्षत्रांच्या (अश्विनी, आश्लेषा, मघा, ज्येष्ठा, मूळ, रेवती) संधिविहित काळात जन्म झाल्यास बालकाच्या सुदृढ आयुष्यासाठी २७ झाडांच्या पानांनी आणि विधीवत हवनाने ही पूजा केली जाते.",
      benefits: ["बालकाच्या आरोग्यातील बाळंत क्लेश निघून जातात", "पालकांच्या आर्थिक आणि वैयक्तिक कष्टांमध्ये कमालीची घट", "घरातील सर्व नकारात्मक ऊर्जेचा समूळ नाश"],
      materialsNeeded: ["२७ औषधी पाळेमुळे", "२७ नद्यांचे पवित्र पाणी", "यज्ञ समिधा", "पंचगव्य"]
    },
    {
      id: "p-dos-sc",
      category: "Kundali Dosh",
      title: "Surya Chandra Dosh Puja",
      marathiTitle: "सूर्य-चंद्र युती दोष (अमावास्या जन्म) पूजा",
      description: "अमावास्येला जन्म झाल्यास सूर्य आणि चंद्र एकत्र आल्याने चंद्र पूर्णपणे लुप्त होतो, परिणामी आत्मविश्वास प्रचंड ढासळतो व मनाला तीव्र क्लेश होतो. शिव-पार्वतीच्या उपासनेने याची शांतता केली जाते.",
      benefits: ["मानसिक अस्थिरता आणि दुहेरी विचारसरणी नाहीशी होते", "आईशी आणि वडिलांशी असणारे वैचारिक मतभेद मिटतात", "कारकिर्दीत आत्मविश्वासाने मोठी झेप घेता येते"],
      materialsNeeded: ["तांबे व चांदीचा सूर्य-चंद्र", "रुद्र पठण", "पांढरे व लाल वस्त्र", "मखणा खीर"]
    },
    {
      id: "p-dos-sm",
      category: "Kundali Dosh",
      title: "Surya Mangal Dosh Puja",
      marathiTitle: "सूर्य-मंगळ अंगारक अंगार दोष शांती पूजा",
      description: "अतिशय प्रखर आणि उष्ण प्रवृत्तीचे हे दोन ग्रह एकत्र आल्याने व्यक्तीमध्ये कमालीचा अहंकार, क्रोध आणि अपघात होण्याची शक्यता बळावते. शांत आणि गोड स्वभावाचा विकास व्हावा म्हणून ही विशेष पूजा केली जाते.",
      benefits: ["राग आणि आक्रस्ताळे स्वभाव गुणांवर कमालीचे नियंत्रण येते", "अपघाती आणि अग्निकांड धोक्यांपासून उकल सुटका", "भाऊ व मित्रांसोबतच्या वादात सुवर्णमध्य निघतो"],
      materialsNeeded: ["लाल चंदन", "मसुरी हुत", "गूळ आणि बाजरीचे नैवेद्य"]
    },
    {
      id: "p-dos-ss",
      category: "Kundali Dosh",
      title: "Surya Shani Dosh Puja",
      marathiTitle: "सूर्य-शनी युती (पितृ-पुत्र वैर) शांती पूजा",
      description: "सूर्य आणि शनी हे पिता-पुत्र असून त्यांच्यात कमालीचे वैर आहे. जेव्हा हे ग्रह कुंडलीत एकत्र येतात, तेव्हा यशासाठी जीवापाड कष्ट करावे लागतात व पालकांशी प्रचंड वैचारिक मतभेद होतात. त्यांच्या सौहार्दासाठी ही शांतता अतिशय गरजेची आहे.",
      benefits: ["प्रयत्नांचे फळ त्वरित मिळून कौटुंबिक सौख्य प्रस्थापित होते", "वडिलांच्या नाराजीपासून सुटका व त्यांचे आशीर्वाद प्राप्त होतात", "नोकरीमध्ये वरिष्ठांकडून होणारा मानसिक त्रास कमी होतो"],
      materialsNeeded: ["काळे तीळ आणि गहू अर्पण विधी", "मोहरीचे तेल", "लोखंडी यंत्र"]
    },
    {
      id: "p-dos-sr",
      category: "Kundali Dosh",
      title: "Surya Rahu Dosh Puja",
      marathiTitle: "सूर्य-राहू ग्रहण दोष शांती पूजा",
      description: "राहू सूर्याला गिळंकृत करतो त्यामुळे ग्रहण दोष तयार होतो, ज्यामुळे शारीरिक तेज कमी होते, मानसिक छळ होतो आणि समाजात मानहानी सोसावी लागते. या दोषाच्या तीव्र शांतीसाठी केलेली महाविधी पूजा.",
      benefits: ["समाजात गेलेली प्रतिष्ठा आणि नोकरीत सन्मान परत मिळतो", "वर्चस्व राखण्यास व खोट्या आळातून मुक्त होण्यास मदत", "हृदय आणि हाडांच्या आरोग्यातील सुधारणा"],
      materialsNeeded: ["जौ (यव)", "नारळ दान विधी", "सूर्य गायत्री मंत्र मंत्रोच्चार", "तांब्या पत्र"]
    },
    {
      id: "p-dos-sk",
      category: "Kundali Dosh",
      title: "Surya Ketu Dosh Puja",
      marathiTitle: "सूर्य-केतू युती कठीण दोष निवारण पूजा",
      description: "सूर्य आणि केतूच्या युतीमुळे व्यक्ती अतिशय टोकाचे आध्यात्मिक निर्णय घेते परंतु संसारात उदासीन राहते, तसेच वडिलांच्या प्रकृतीला गंभीर त्रास होतो. याचे संतुलन करण्यासाठी ही पूजा विहित आहे.",
      benefits: ["संसार आणि अध्यात्मात योग्य संतुलन साधणे शक्य होते", "वडिलांच्या दीर्घ कष्टाच्या आजारांमध्ये आराम पडतो", "अनाकलनीय भीती आणि आत्मघाती विचारांपासून सुटका"],
      materialsNeeded: ["पाच रंगी लोकर गुच्छ", "केसर कुंकू", "कापूर आरती"]
    },
    {
      id: "p-dos-cr",
      category: "Kundali Dosh",
      title: "Chandra Rahu Dosh Puja",
      marathiTitle: "चंद्र-राहू मानसिक ग्रहण दोष शांती पूजा",
      description: "चंद्रावर राहूचे सावट आल्यामुळे मानसिक ग्रहण लागल्यासारखी स्थिती होते, परिणामी व्यक्ती संशयी विचार करते व आत्महत्येचे किंवा कमालीचे नैराश्याचे विचार मनात येतात. या मानसिक शांततेसाठी महाविधी मंत्र हवन केले जाते.",
      benefits: ["संशयी वृत्ती आणि सततच्या नकारात्मक विचारांवर नियंत्रण", "मानसिक शांतता, आनंदी स्वभाव आणि उत्तम कलावंत वृत्ती", "भयाच्या आणि नैराश्याच्या आजारांवर जलद मात"],
      materialsNeeded: ["चांदीचे भांडे देव विधी", "पांढऱ्या गाईचे तूप", "कापूर परिमळ धूप"]
    },
    {
      id: "p-dos-ck",
      category: "Kundali Dosh",
      title: "Chandra Ketu Dosh Puja",
      marathiTitle: "चंद्र-केतू युती (पिसाच्च योग) पीडा शांती पूजा",
      description: "चंद्र आणि केतूचा संयोग झाल्याने व्यक्तीला भुताखेतांची किंवा गूढ शक्तींची अनाकलनीय भीती वाटते. मन कोणत्याही एका गोष्टीवर लक्ष केंद्रित करू शकत नाही. या विचलित मनाला पवित्र शांती देण्यासाठी ही विशेष पूजा केली जाते.",
      benefits: ["अनाकलनीय भीती, दचकून जाणे, वाईट स्वप्नांपासून कायमची सुटका", "कौटुंबिक जीवनात आंतरिक आत्मिक शांती लाभते", "चित्ताची एकाग्रता कमालीची वाढते"],
      materialsNeeded: ["गंगाजल अभिषेक", "कुश गवत आसन", "दही भात दान विधी"]
    },
    {
      id: "p-dos-mr",
      category: "Kundali Dosh",
      title: "Mangal Rahu Dosh Puja",
      marathiTitle: "मंगळ-राहू अंगारक आणि विष योग शांती पूजा",
      description: "मंगळाची शक्ती आणि राहूची कुटिलता एकत्र आल्यावर प्रचंड विनाशकारी क्रोधाचा योग बनतो. व्यक्ती बेकायदेशीर कामांमध्ये गुंतण्याची भीती असते. या अतिरिक्त विनाशक ऊर्जेला सकारात्मक मार्गाला लावण्यासाठी ही पूजा केली जाते.",
      benefits: ["गुन्हेगारी किंवा बेकायदेशीर प्रवृत्तीवर नियंत्रण", "अतिशय क्रोधी आणि हिंसक स्वभावाचे शांत स्वरूप", "विविध अपघात व वादांमध्ये होणारे मोठे नुकसान टळणे"],
      materialsNeeded: ["मसुरी हुत विधी", "काळे अंजन", "महामृत्युंजय पठण साहित्य"]
    },
    {
      id: "p-dos-mk",
      category: "Kundali Dosh",
      title: "Mangal Ketu Dosh Puja",
      marathiTitle: "मंगळ-केतू युती (विष विस्फोट योग) शांती पूजा",
      description: "मंगळ आणि केतू एकत्र आल्यामुळे रक्ताचे आजार, शस्त्रक्रिया आणि अचानक अपघाती धोके वाढतात. शरीरातील प्रज्वलित ऊर्जा सम प्रमाणात प्रवाहित व्हावी म्हणून शांतता विधी केला जातो.",
      benefits: ["वारंवार होणाऱ्या शस्त्रक्रिया आणि अपघातातून सुरक्षा", "रक्तशुद्धी आणि शारीरिक तजेला मिळण्यात यश", "शत्रूंच्या छुपे हल्ल्यांपासून कायमचे संरक्षण"],
      materialsNeeded: ["लाल फुलांचा गुच्छ", "मध धूप नैवेद्य", "केसर तिलक विधी"]
    },
    {
      id: "p-dos-gr",
      category: "Kundali Dosh",
      title: "Guru Rahu Dosh Puja",
      marathiTitle: "गुरु-राहू चांडाल दोष निवारण महापूजा",
      description: "कुंडलीतील अत्यंत घातक मानला जाणारा 'गुरु चांडाल योग' यामुळे व्यक्तीचे भाग्य संपुष्टात येते, शिक्षणात अनपेक्षित अपयश येते आणि गुरु-वडिलांचे आशीर्वाद लाभत नाहीत. यासाठी राहू शांती आणि गुरु अनुकूलता महापूजा केली जाते.",
      benefits: ["चांडाल दोषाचे संपूर्ण परिणाम शांत होऊन भाग्य उजळते", "उच्च शिक्षणात आणि नोकरीत मोठा मान-सम्मान व नोकरी प्राप्त होते", "धार्मिक वृत्ती वाढून समाजात आदराचे स्थान मिळते"],
      materialsNeeded: ["पिवळी फुले", "चण्याची डाळ", "राहू यंत्र", "समिधा हवन"]
    },
    {
      id: "p-dos-gk",
      category: "Kundali Dosh",
      title: "Guru Ketu Dosh Puja",
      marathiTitle: "गुरु-केतू युती (अध्यात्म आणि संघर्ष) शांती",
      description: "गुरु आणि केतूच्या युतीमुळे व्यक्ती घर-संसार सोडून दूर निघून जाण्यास प्रवृत्त होते, किंवा सांसारिक जबाबदाऱ्यांबद्दल अत्यंत तीव्र संघर्ष करावा लागतो. याचे वेळेत निवारण करणे आवश्यक आहे.",
      benefits: ["संसार कर्तव्य आणि मोक्ष प्राप्तीत समतोल साधता येतो", "निराश मनाला सुयोग्य दिशा प्राप्त होते", "मुलांच्या संतती प्राप्तीत येणारे अडथळे दूर होतात"],
      materialsNeeded: ["तांदूळ", "केळीची फळे", "कमळ गट्टी माळ", "गंगाजल"]
    },
    {
      id: "p-dos-sc-shani",
      category: "Kundali Dosh",
      title: "Shani Chandra Dosh Puja",
      marathiTitle: "शनी-चंद्र विष योग शांती महापूजा",
      description: "शनी आणि चंद्राची युती कुंडलीत विष योग तयार करते, ज्यामुळे व्यक्ती कायम नैराश्य, दारिद्र्य आणि तीव्र मानसिक संघर्षाचा सामना करते. महादेवाच्या रुद्र अभिषेकाने या दोषाचे तीव्र परिणाम शांत केले जातात.",
      benefits: ["विष योगाचे कठीण परिणाम शांत होऊन मन प्रफुल्लित बनते", "अचानक होणारे मोठे आर्थिक नुकसान व संकटे थांबतात", "कौटुंबिक सुखाची दारे पुन्हा उघडली जातात"],
      materialsNeeded: ["रुद्राभिषेक विधी", "पांढरा आणि काळा तीळ", "तांदूळ आणि दूध"]
    },
    {
      id: "p-dos-sr-shani",
      category: "Kundali Dosh",
      title: "Shani Rahu Dosh Puja",
      marathiTitle: "शनी-राहू श्रापित दोष निवारण पूजा",
      description: "शनी आणि राहूच्या युतीमुळे कुंडलीत गंभीर श्रापित दोष तयार होतो, ज्यामुळे पिढ्यानपिढ्या घराण्यात गरिबी, सुखी आयुष्याचा अभाव आणि कर्ज बाजारीपणा चालू राहतो. या शांती पूजेने पूर्वजांचे व घराण्याचे दोष दूर होतात.",
      benefits: ["पिढ्यानपिढ्या चालत आलेले गरिबी आणि दुःखाचे मळभ दूर होते", "व्यवसायात अकल्पनीय यश व नवीन उलाढाल सिद्ध होते", "कर्ज मुक्तीसाठी विशेष व प्रगतीशील मार्ग मोकळे होतात"],
      materialsNeeded: ["लोहपत्र", "काळे तीळ", "मोहरीचे तेल", "महा विधी हवन सामग्री"]
    },
    {
      id: "p-dos-sk-shani",
      category: "Kundali Dosh",
      title: "Shani Ketu Dosh Puja",
      marathiTitle: "शनी-केतू युती (गूढ पीडा) शांती पूजा",
      description: "शनी आणि केतू एकत्र आल्यामुळे व्यक्तीला गंभीर गूढ वेदना, पाठदुखी आणि शारीरिक व्याधींचा विनाकारण त्रास होतो. सुदृढ आरोग्यासाठी हनुमान साधना व शांतता विधी केला जातो.",
      benefits: ["दीर्घकालीन अस्थिव्याधी, पाठदुखी आणि शारीरिक क्लेशात आराम मिळतो", "मानसिक अनिश्चितता संपुष्टात येऊन निर्णय अचूक ठरतात", "शत्रूंपासून आणि कोर्ट कचेरीच्या त्रासापासून सुटका"],
      materialsNeeded: ["रुई पानांचे हार", "काळा तीळ", "बिब्बा आणि गुळ-धूप"]
    }
  ];

  const filteredPujas = pujas.filter(puja => {
    const matchesSearch = 
      puja.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      puja.marathiTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      puja.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "All") {
      return matchesSearch;
    }
    return puja.category === selectedCategory && matchesSearch;
  });

  const handleOpenBooking = (puja: PujaItem) => {
    setSelectedPuja(puja);
    setBookingName("");
    setBookingPhone("");
    setBookingDate("");
    setBookingSuccess(false);
    setShowBookingModal(true);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !bookingDate) {
      alert("कृपया सर्व माहिती अचूक भरा.");
      return;
    }
    setBookingSuccess(true);
    setTimeout(() => {
      setShowBookingModal(false);
      setSelectedPuja(null);
    }, 4500);
  };

  return (
    <div className="bg-[#fdfcf9] rounded-md border-2 border-slate-900 shadow-[8px_8px_0px_rgba(26,26,26,0.06)] overflow-hidden">
      
      {/* Banner portion */}
      <div className="bg-gradient-to-r from-[#0B3C5D] to-slate-950 text-white p-6 border-b-2 border-slate-900 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2B705]/5 rounded-full -mr-8 -mt-8 animate-pulse"></div>
        <div className="relative z-10 text-left space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#F2B705] bg-[#F2B705]/15 px-3 py-1 rounded border border-[#F2B705]/20 font-extrabold shadow-sm">
            वैदिक यज्ञ आणि दोष शांती • Authentic Vedic Rituals
          </span>
          <h3 className="font-serif font-black text-xl md:text-2xl text-white flex items-center gap-2">
            🔱 Astropatri Sacred Puja Sanctuary
          </h3>
          <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
            तुमच्या कुंडलीतील दोष दूर करण्यासाठी आणि जीवनात सुख, समृद्धी, उत्तम आरोग्य व विवाह योग प्राप्त करण्यासाठी आचार्य पाठक अण्णा यांच्या मार्गदर्शनाखाली पूर्णपणे वैदिक पद्धतीने शास्त्रोक्त पूजा संकल्प सिद्ध केला जातो.
          </p>
        </div>
      </div>

      {/* Control panel of Pujas */}
      <div className="p-4 bg-stone-50 border-b border-slate-200 space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="पायरीनुसार पूजा किंवा दोष शोधा (उदा. लक्ष्मी, शांतता, मटण, पितृदोष)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-slate-900 rounded px-4 py-3 text-xs text-slate-800 placeholder-stone-400 focus:outline-none focus:border-[#0B3C5D] shadow-[2px_2px_0px_rgba(26,26,26,1)] transition-all font-sans"
          />
          <Search className="w-4 h-4 text-[#0B3C5D] absolute right-4 top-3.5" />
        </div>

        {/* Categories Tab Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-300">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-wider rounded border-2 transition whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === cat.value
                  ? "bg-[#0B3C5D] text-[#F2B705] border-slate-900 shadow-[2px_2px_0px_rgba(26,26,26,1)]"
                  : "bg-white text-slate-700 border-stone-200 hover:bg-stone-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Grid view of matching items */}
      <div className="p-6">
        {filteredPujas.length === 0 ? (
          <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-md">
            <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-spin" />
            <p className="text-sm font-serif font-black text-slate-800">कोणतीही पूजा आढळली नाही</p>
            <p className="text-xs text-stone-500 mt-1">दुसरे शब्द वापरून शोधण्याचा प्रयत्न करा किंवा वरील फिल्टर बदला.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPujas.map((puja) => (
              <div 
                key={puja.id}
                className="bg-white border-2 border-slate-900 rounded-lg p-5 text-left flex flex-col justify-between shadow-[4px_4px_0px_rgba(11,60,93,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 group relative"
              >
                {/* Visual Category Label tag */}
                <div className="absolute top-4 right-4 text-[9px] uppercase font-mono font-black border border-[#0B3C5D]/20 bg-[#0B3C5D]/5 px-2.5 py-1 rounded text-[#0B3C5D]">
                  {puja.category}
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <h4 className="font-serif font-black text-[#0B3C5D] text-base md:text-lg group-hover:text-slate-950 transition">
                      {puja.marathiTitle}
                    </h4>
                    <span className="text-[10px] text-stone-400 font-mono italic block mt-0.5">
                      Vedic Name: {puja.title}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed bg-[#fdfcf9] border-l-4 border-[#F2B705] p-3 rounded-r">
                    {puja.description}
                  </p>

                  {/* Key Benefits of perform */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-black uppercase text-[#0B3C5D] tracking-wide block">
                      ⭐️ पूजेचे मुख्य लाभ (Key Benefits) :
                    </span>
                    <ul className="space-y-1 text-xs text-stone-600 pl-1">
                      {puja.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Materials Required preview */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase text-stone-400 tracking-wide block">
                      📦 मुख्य पूजा साहित्य (Key Materials) :
                    </span>
                    <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                      {puja.materialsNeeded.join(", ")} व इतर होम साहित्य हवन सामग्री.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-stone-400">
                    मार्गदर्शन: पाठक अण्णा
                  </span>
                  <button
                    onClick={() => handleOpenBooking(puja)}
                    className="bg-[#F2B705] text-[#1a1a1a] border-2 border-slate-900 px-4 py-1.5 text-xs font-black rounded shadow-[2px_2px_0px_rgba(26,26,26,1)] hover:shadow-none hover:bg-amber-400 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>पूजा संकल्प बुक करा</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advisory section */}
      <div className="bg-[#0B3C5D]/5 p-5 border-t-2 border-slate-900 text-left space-y-2">
        <h5 className="font-serif font-black text-sm text-slate-900 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#F2B705]" />
          शास्त्रोक्त विधी व वैदिक संकल्प सुरक्षा
        </h5>
        <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
          १. सर्व पूजा विधी आचार्य पाठक अण्णा आणि शास्त्रशुद्ध ब्राह्मण चमूद्वारे तुमच्या जन्म पत्रिकेनुसार योग्य शुभ मुहूर्तात पार पाडल्या जातात.<br/>
          २. तुम्ही घरबसल्या देखील लाईव्ह व्हिडिओ कॉलिंगद्वारे किंवा ऑफलाईन पद्धतीने थेट आश्रमात हजेरी लावून पूजा संकल्प पूर्ण करू शकता.<br/>
          ३. पूजेनंतर अचूक मंत्र सिद्ध प्रसाद आणि सिद्ध केलेले रक्षा यंत्र तुमच्या घरच्या पत्त्यावर स्पीड पोस्ट द्वारे मोफत पाठवले जाते.
        </p>
      </div>

      {/* Booking Form Dialog Modal */}
      {showBookingModal && selectedPuja && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-[#fcfbf9] border-4 border-slate-900 rounded-lg max-w-md w-full shadow-[8px_8px_0px_rgba(26,26,26,1)] overflow-hidden animate-scale-in">
            
            {/* Modal Title Banner */}
            <div className="bg-[#0B3C5D] text-white p-4 border-b-2 border-slate-900 relative">
              <h4 className="font-serif font-black text-sm">🗓️ पूजा संकल्प नोंदणी अर्ज</h4>
              <p className="text-[10px] text-amber-400 mt-0.5">{selectedPuja.marathiTitle}</p>
            </div>

            <div className="p-5">
              {bookingSuccess ? (
                <div className="text-center py-6 space-y-3.5">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-300 animate-bounce">
                    <Check className="w-6 h-6" />
                  </div>
                  <h5 className="font-serif font-black text-base text-emerald-950">पूजा संकल्प यशस्वीरित्या नोंदवला गेला!</h5>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    प्रिय <strong>{bookingName}</strong>, तुमच्या वतीने <strong>{selectedPuja.marathiTitle}</strong>चा संकल्प नोंदवला गेला आहे. आमचे पंडित २४ तासांच्या आत कुंडली विश्लेषण करून शुभ मुहूर्त निश्चित करण्यासाठी तुम्हाला संपर्क साधतील.
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono">प्रसाद डिलिव्हरी व विधी माहिती व्हॉट्सॲपवर पाठवली जाईल.</p>
                </div>
              ) : (
                <form onSubmit={handleBookSubmit} className="space-y-4 text-left">
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-stone-700 block">यजमानाचे संपूर्ण नाव (Name of Yajman) :</label>
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="उदा. राजेश विनायक पाठक"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#0B3C5D] font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-stone-700 block">संपर्क किंवा व्हॉट्सॲप नंबर (WhatsApp Mobile) :</label>
                    <input
                      type="tel"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="उदा. +91 9876543210"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#0B3C5D] font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-stone-700 block">पूजा करण्यासाठी अपेक्षित तारीख (Preferred Date) :</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#0B3C5D] font-sans"
                    />
                  </div>

                  <div className="bg-[#F2B705]/10 p-3 rounded border border-[#F2B705]/35 text-[10px] text-stone-600 leading-relaxed font-sans">
                    <strong>टीप:</strong> पूजेचा शुभ मुहूर्त ठरवण्यासाठी आपल्या जन्म पत्रिकेचा अभ्यास केला जाईल व आचार्य पाठक अण्णा स्वतः आपल्याला मार्गदर्शन करतील.
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookingModal(false);
                        setSelectedPuja(null);
                      }}
                      className="w-1/2 p-2 border-2 border-slate-900 text-xs font-black rounded hover:bg-stone-100 transition cursor-pointer text-center"
                    >
                      रद्द करा
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 p-2 bg-[#0B3C5D] text-white border-2 border-slate-900 text-xs font-black rounded hover:bg-[#072d47] transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>नोंदणी पूर्ण करा</span>
                    </button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
