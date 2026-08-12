/* Shared Organization + WebSite structured data, injected on every public
   page so Google resolves ONE consistent entity for the brand instead of
   inferring a different one per page. Product schema stays inline. */
(function(){
  var d = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://everythingremotejob.com/#organization",
      "name": "Everything Remote Job",
      "alternateName": "ERJ",
      "url": "https://everythingremotejob.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://everythingremotejob.com/logo.png",
        "width": 512,
        "height": 512
      },
      "description": "Everything Remote Job trains and places African professionals into globally competitive, dollar-paying remote roles.",
      "parentOrganization": {
        "@type": "Organization",
        "name": "Business Play Limited"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Abuja",
        "addressCountry": "NG"
      },
      "areaServed": [
        {
          "@type": "Place",
          "name": "Africa"
        },
        {
          "@type": "Place",
          "name": "Nigeria"
        }
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "telephone": "+234-803-292-5957",
        "availableLanguage": [
          "en"
        ]
      },
      "foundingDate": "2013",
      "founder": {
        "@id": "https://everythingremotejob.com/#oluwaseyi-ashiru"
      }
    },
    {
      "@type": "Person",
      "@id": "https://everythingremotejob.com/#oluwaseyi-ashiru",
      "name": "Oluwaseyi Ashiru",
      "givenName": "Oluwaseyi",
      "familyName": "Ashiru",
      "jobTitle": "Lead Facilitator",
      "description": "Founder and Lead Facilitator of Everything Remote Job. Has trained professionals into globally competitive remote roles since 2013.",
      "url": "https://everythingremotejob.com/#about",
      "image": "https://everythingremotejob.com/founder-oluwaseyi.jpg",
      "worksFor": {
        "@id": "https://everythingremotejob.com/#organization"
      },
      "knowsAbout": [
        "Remote work",
        "Global job search",
        "CV and LinkedIn optimisation",
        "Asynchronous communication",
        "Salary negotiation"
      ],
      "sameAs": [
        "https://www.linkedin.com/in/oluwaseyiashiru/"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://everythingremotejob.com/#website",
      "url": "https://everythingremotejob.com/",
      "name": "Everything Remote Job",
      "publisher": {
        "@id": "https://everythingremotejob.com/#organization"
      },
      "author": {
        "@id": "https://everythingremotejob.com/#oluwaseyi-ashiru"
      },
      "inLanguage": "en",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://everythingremotejob.com/blog.html?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ]
};
  var s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(d);
  document.head.appendChild(s);
})();