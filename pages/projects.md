---
title: Projects - Bicheng Gu
display: Projects
description: A Collections of my interest
wrapperClass: 'text-center'
art: dots
projects:
  Current Focus:
    - name: 'Elite CoPilot'
      link: 'https://elitetaxsystems.com/Solution-EliteCopilot'
      desc: 'Enterprise fleet safety solution, safe guarding all road users.'
      icon: 'i-lineicons-road'
    - name: 'AI Toy'
      link: 'https://bicheng.me/projects'
      desc: 'Bringing toys to live, powered by AI.'
      icon: 'i-eos-icons-machine-learning-outlined'
    - name: 'LED Display'
      link: 'https://bicheng.me/projects'
      desc: 'Innovating LED display for vehicles.'
      icon: 'i-material-symbols-light-nest-display-max-outline'

  Vibe Coding:
    - name: 'Boke Tools Repair Portal'
      link: 'https://boke-repair-dep.vercel.app/'
      desc: 'An online portal for customer to track the status of the repair order.'
      icon: 'i-carbon-task-tools'
    - name: 'Elite CoPilot Landing Page'
      link: 'https://copilot.elitetaxsystems.com/'
      desc: 'Specially designed landing page for marketing campaign.'
      icon: 'i-hugeicons-web-design-01'
    - name: 'Faang Studio'
      link: 'https://faang.studio'
      desc: 'Faang Studio by Fang Jie aims to bring confidence to women from within.'
      icon: 'i-maki-hairdresser'

  Fork & Learn:
    - name: 'Dithering g'
      link: 'https://gu.bicheng.me'
      desc: 'A dithering 3D g letter.'
      icon: 'i-ion-social-google-outline'
    - name: 'SG Roads'
      link: 'https://sg.bicheng.me/'
      desc: 'All roads in Singapore.'
      icon: 'i-gis-road-map'
    - name: 'bcOs'
      link: 'https://os.bicheng.me/'
      desc: 'A operation system that lives in your browser.'
      icon: 'i-eos-icons-installing'
    - name: 'Resume'
      link: 'https://cv.bicheng.me/'
      desc: 'A copy of my personal resume.'
      icon: 'i-pepicons-pencil-cv'

  Machine Learning:
    - name: 'Fun with Computer Vision'
      link: 'https://bicheng.me/projects'
      desc: 'A collection of many small computer vision projects.'
      icon: 'hamsa'
    - name: 'Book Recommender System'
      link: 'https://github.com/Bicheng-G/Book-recommender-system'
      desc: 'Built a content-based filtering system with automatic tagging system.'
      icon: 'i-mdi-bookshelf'
    - name: 'Fake News Detection System'
      link: 'https://github.com/Bicheng-G/Fake-News-Detection'
      desc: 'Analyse the features to identify and flag fake news using ML models.'
      icon: 'i-game-icons-newspaper'

  Data Analytics:
    - name: 'Geospatial Analysis'
      link: 'https://github.com/Bicheng-G/Geospatial-Analytics'
      desc: 'Using geospatial data to analyse Singapore HDB flat price.'
      icon: 'i-geo-turf-center'
    - name: 'Marketing Analysis'
      link: 'https://github.com/Bicheng-G/Marketing-Analytics'
      desc: 'Market segmentation analysis & Lead scoring.'
      icon: 'i-hugeicons-analysis-text-link'
    - name: 'Data Visualization on Customer Churn'
      link: 'https://public.tableau.com/views/CaseStudyAnalyzingCustomerChurninTableau_17069484015320/CaseStudyAnalyzingCustomerChurninTableau?:language=en-GB&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
      desc: 'A case study analyzing customer churn in Tableau.'
      icon: 'i-logos-tableau-icon'     

  Programming:
    - name: 'Duke'
      link: 'https://bicheng-g.github.io/duke/'
      desc: 'The chatbot for your task management.'
      icon: 'i-mdi-google-assistant'

  Scripts:
    - name: 'Tik Tok Downloader Shortcut'
      link: 'https://github.com/antfu/1990-script'
      desc: 'Download Douyin Video without watermark on iOS.'
      icon: 'i-carbon-download'
    - name: 'Yellow Page Scraper'
      link: 'https://github.com/Bicheng-G/yellowpages-scraper-r'
      desc: 'A tool to scrape business listings data from Yellow Page.'
      icon: 'i-mdi-spider-thread'
---

<!-- @layout-full-width -->
<ListProjects :projects="frontmatter.projects" />
