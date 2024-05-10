'use client'

import { useEffect, useState, useRef } from 'react'
import DappNavbar from '@/components/DappNavbar'
import Footer from '@/components/newFooter'
import MobileFooterSection from '@/components/mobileFooter'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { Menu, MenuButton } from '@szhsin/react-menu'
import { useLandingPageStore } from '@/store/store'

import mesh1 from '@assets/images/mesh1.png'
import tw from '@assets/images/tradingview.png'
import { GoArrowRight } from 'react-icons/go'

export default function PrivacyPolicy() {
	const { mode } = useLandingPageStore()

	return (
		<>
			<Head>
				<title>Nex Labs - Privacy Policy</title>
				<meta name="description" content="Nex Labs is reinventing trading with the cutting-edge trade page. Seamlessly swap, trade and invest in innovative indices, and access unique products - all integrated with your wallet for smooth trading." />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main
				className={`m-0 min-h-screen h-fit w-screen ${mode == 'dark' ? 'text-[#F2F2F2] bg-gradient-to-tl from-[#050505] to-[#050505]' : 'text-[#2A2A2A] bg-whiteBackground-500'
					} p-0 overflow-x-hidden`}
			>

				<DappNavbar />
				<section className="w-screen h-fit flex flex-col items-stretch justify-start px-4 lg:px-10 pt-10 pb-12">
					<h5 className={` text-4xl interBold mb-6 ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>Privacy Policy - NEX Labs</h5>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						This Privacy Policy describes NEXLABS{"'"} practices regarding the collection, use and protection of personal data as part of our decentralized cryptocurrency trading platform.
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						The NEXLABS Protocol operates in a decentralized and permissionless manner, not collecting personal data directly from its users. Although we may collect and process information about users of nexlabs.io or the Interface in accordance with this Privacy Policy, we do not have information on all users of the protocol beyond what is already publicly available and recorded on the blockchain.
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						This Privacy Policy (the “Privacy Policy”) explains how NEXLABS (“we,” “our,” or “us”) collects, uses and shares information in connection with our Services, and your rights and choices regarding that information. These terms apply to nexlabs.io and to the Interface and any other online locations that link to this Privacy Policy (collectively, the “Services”).
						By using the Services, you also agree to our collection, use and sharing of your information as described in this Privacy Policy. If you do not agree to the Terms of Use, you should not use or access the Interface or the Services.

					</p>
					
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						1. Information gathering
					</p>
					<p className={` text-lg italic leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					Information you provide
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					We may collect the following information about you when you use the Services:
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Correspondence and content, within any message you send to us (such as feedback and questions to information support), we may collect your name and contact information, as well as any other content included in the message.        
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					You may choose to voluntarily provide us with other information that we have not requested from you, and, in such cases, you are solely responsible for that information.
					</p>

					<p className={` text-lg italic leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					Information Collected Automatically
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					We collect the following information:
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Wallet address. We may collect the wallet address you use to connect to the Interface to block wallets associated with certain behavior legally prohibited by the Interface. Separately, we may collect your wallet address as part of “Usage Information” (as described below) to improve the Interface and user experience of the Services.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Device information. We may collect information about the device you use to access the Interface, such as device type, operating system, browser type, and screen height and width. This information helps us optimize the Interface for different devices and resolve any technical problems.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Usage information. We may collect information about how you use the Interface and the Services, including your wallet address, the time you access the Interface, the pages you visit, the features and assets you interact with, the links you click and the search queries you make. By analyzing this data, we gain a deeper understanding of user behavior, which in turn allows us to make continuous improvements to the Interface and improve the overall user experience, in addition, we monitor forto prevent fraudulent activities and finally to develop new features and services
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					For more information about how we use tracking technologies for analytics and your rights and choices in this regard, please see the “Cookie Policy” and “Analytics” sections below.
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						2. Use Of Information
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					We may collect and use information for business purposes in accordance with the practices described in this Privacy Policy. Our business purposes for collecting and using information include:
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Operate and manage the Services (including through authorized service providers). To make the Services available to you and perform services requested by you, such as responding to your comments, questions and requests and providing information support; send you technical communications, updates, security alerts, information about changes to our policies and support, administrative messages; detect, prevent and address fraud, violations of the Terms and threats or harm; and compliance with legal and regulatory requirements.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Improve the Services. To continually improve the Services and fulfill any other legitimate business purposes, as permitted by applicable laws.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Merger or Acquisition. In connection with, or during negotiations of, any proposed or actual merger, purchase, sale, or other acquisition, financing, reorganization, or combination of all or a portion of our assets or transfer of all or a portion of our business to an other activity.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Safety and Compliance with Laws. As we believe it is necessary or appropriate to operate and maintain the security or integrity of the Interface, including to prevent or stop an attack on our computer systems or networks, investigate any wrongdoing in connection with the Interface, enforce our Terms and comply with the applicable laws, legal requests and legal processes, such as responding to subpoenas or requests from government authorities.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Facilitating Requests. To fulfill your requests or instructions.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Consent. Purposes for which we have obtained your consent, as required by applicable laws.
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					Notwithstanding the foregoing, we may use information that does not identify you (including information that has been aggregated or de-identified) for any purpose except as prohibited by applicable law. For information about your rights and choices regarding how we use information about you, please see the “Analytics” section below.
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						3. Sharing and Disclosure of Information
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					We may share or disclose information we collect in accordance with the practices described in this Privacy Policy and for the purposes set forth in the “Use of Information” section above.
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					The categories of parties with whom we may share information include:
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Affiliates. We share information with our affiliates and related entities, including when they act as our service providers or for their own internal purposes.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Professional Consultants. We share information with our professional advisors for audit purposes and compliance with our legal obligations.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Service Providers. We share information with third-party service providers for business purposes, including fraud detection and prevention, security threat detection, data analytics, information technology and blockchain transaction storage and monitoring. Any information shared with such service providers is subject to the terms of this Privacy Policy. All service providers we work with are bound to use the information only on our behalf and in accordance with our instructions.
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					Notwithstanding the foregoing, we may share information that does not identify you (including information that has been aggregated or de-identified) except as prohibited by applicable law. NEXLABS will not share personal data with third parties, as it does not collect it directly. Any data collected is anonymous and used solely for internal purposes.
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						4. Third Party Services
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					We may also integrate technologies operated or controlled by other parties into parts of the Services. For example, the Services may include links that hyperlink to websites, platforms and other services not operated or controlled by us.
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					Please note that when you interact with other parties, including when you leave the Interface, those parties may independently collect information about you and request information from you. The information collected and stored by those parties remains subject to their own policies and practices, including what information they share with us, your rights and choices across their services and devices, and whether they store information in the United States or elsewhere. We encourage you to familiarize yourself with and review their privacy policies and terms of use.
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					For example, by using a third-party wallet to transact on public blockchains, your interactions with any third-party wallet provider are governed by that wallet provider{"'"}s applicable terms of service and privacy policy.
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						5. Cookie Policy
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					We understand that your privacy is important and we are committed to being transparent about the technologies we use. In the spirit of transparency, this Cookie Policy provides detailed information on how and when we use cookies on our Services.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    A- DO WE USE COOKIES?
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    We do not use cookies. If we did, we would use cookies and other technologies to understand how you use our Interface so we can improve its design and functionality (to ensure that everyone using the Interface has the best possible experience)
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    WHAT IS A COOKIE?
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    A cookie is a small text file that is placed on your hard drive by a web page server. Cookies contain information that can later be read by a web server in the domain that issued the cookie to you. Some of the cookies will only be used if you use certain features or select certain preferences, and some cookies will always be used. You can find out more about each cookie by viewing our list of current cookies below. We update this list periodically, so there may be additional cookies not yet listed.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    B- Why should we use cookies?
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    We use cookies and other similar identifiers only to compile aggregate data about Interface traffic and site interaction to offer better user experiences and tools in the future.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    C- What types of cookies do we use?
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Strictly necessary cookies: These cookies are essential for the correct functioning of the Interface and enable basic functionality such as page navigation and access to protected areas of the site. They do not collect personal information.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Analytical/performance cookies: These cookies allow us to analyze how visitors use the Interface, which helps us improve its functionality and performance.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - Functional cookies: These cookies allow advanced functionality and personalization of the website. They can remember your preferences, such as the wallet you previously used to connect.
					</p>

					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Q. How to disable cookies?
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Users can generally activate or subsequently deactivate the use of cookies via a functionality built into their web browser. If you would like to know more about cookies, or how to control, disable or delete them, visit <Link className=' underline text-blue-600' href={"http://www.aboutcookies.org"} target='_blank'>http://www.aboutcookies.org</Link> for a detailed guide.
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						6. Analytics
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					We use the Mixpanel analytics platform to track user interactions, preferences and behavior during browsing sessions for users who have opted in to analytics. This data helps us improve our services and analyze trends in our user base. We respect your right to control the data collected during your browsing session. If you prefer not to participate in our tracking and data collection techniques, you can opt out through the “Manage Analytics” section on this page or adjust your browser settings or use browser extensions designed for this purpose.
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						7. Data Security
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					NEXLABS uses blockchain technologies to ensure the security and transparency of transactions. As we are not custodians of personal data, security focuses on protecting the integrity of the platform.
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					We implement and maintain reasonable administrative, physical and technical safeguards to protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration and destruction. However, transmission over the Internet is not completely secure and we cannot guarantee the security of any information about you.
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						8. Data Retention
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					Please note that we retain the information we collect for as long as necessary to fulfill the purpose for which it was collected, as described in this Privacy Policy, and to the extent permitted by applicable legal requirements. Where you request deletion of your information, we may continue to retain and use your information as permitted or required by applicable law, for legal, tax or regulatory reasons, or for legitimate and lawful business purposes.
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						9. International Transfers
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					Please be aware that information collected through the Services may be transferred to, processed, stored and used in the European Economic Area, the United Kingdom and other jurisdictions. Data protection laws in the EU and other jurisdictions may be different from those in your country of residence. Your use of the Services or provision of any information therefore constitutes your consent to the transfer to and from, processing, use, sharing and storage of information about you in the EU and other jurisdictions as set forth in this Privacy Policy.
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						10. Additional Disclosures for California Residents
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					These additional disclosures apply only to California residents. The California Consumer Privacy Act of 2018 (“CCPA”) provides additional rights to know, delete and choose, and requires businesses that collect or disclose personal information to provide notice and a means to exercise consumer rights.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    A- Notice Collection
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    For further details about the information we may collect, including the sources from which we receive information, please see the “Collection of Information” section above. We may collect and use these categories of personal information for the business purposes described in the “Use of Information” section above, including to administer the Services.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    We do not {'"'}sell{'"'} personal information as defined by the CCPA. Please see the “Information Sharing and Disclosure” section above for further details on the categories of parties with whom we share information.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    B- Right to Know and Delete
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    You have the right to know certain details about our data practices over the preceding twelve (12) months. In particular, you can request the following:
					</p>
					<p className={` text-lg ml-6 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - The categories of personal information we have collected about you;
					</p>
					<p className={` text-lg ml-6 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - The categories of personal information about you that we disclosed for a business purpose;
					</p>
					<p className={` text-lg ml-6 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - The categories of third parties to whom the personal information has been disclosed for a business purpose;
					</p>
					<p className={` text-lg ml-6 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - The business or commercial purpose for collecting or selling your personal information;
					</p>
					<p className={` text-lg ml-6 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - The specific personal information we have collected about you.
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					Additionally, you have the right to delete the personal information we have collected about you.
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					To exercise any of these rights, please email a request to nexlabs.info@gmail.com. In your request, please specify which right you are trying to exercise and the scope of your request. We will confirm receipt of your request within ten (10) days. We may request specific information from you to help us verify your identity and process your request. If we are unable to verify your identity, we may deny your requests to know or delete.
					</p>

					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    C- Authorized Agent
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    You may designate an authorized agent to submit requests on your behalf; however, we may require written evidence of the agent{"'"}s permission to act on your behalf and directly verify your identity.
					</p>

					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    D- Right of non-discrimination
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    You have the right to non-discrimination for the exercise of any of your privacy rights afforded by law, such as the right to access, delete, or opt-out of the sale of your personal information.
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						11. Further Disclosures for Data Subjects in the European Economic Area and the United Kingdom
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					Please note that we retain the information we collect for as long as necessary to fulfill the purpose for which it was collected, as described in this Privacy Policy, and to the extent permitted by applicable legal requirements. Where you request deletion of your information, we may continue to retain and use your information as permitted or required by applicable law, for legal, tax or regulatory reasons, or for legitimate and lawful business purposes.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    A- Roles
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    The General Data Protection Regulation in the European Economic Area and the United Kingdom General Data Protection Regulation (“GDPR”) distinguish between organizations that process personal data for their own purposes (known as “controllers”) and organizations that process personal data on behalf of other organizations (known as {'"'}processors{'"'}). We act as a controller with respect to personal data collected when you interact with the Services.
					</p>

					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    B- Legal Basis for Processing
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    The EU General Data Protection Regulation (GDPR) and UK GDPR requires a {'"'}legal basis{'"'} for the processing of personal data. Our legal bases include where: (i) Consent: You have provided consent to the processing of your personal data for one or more specific purposes, either to us or to our service providers or partners. (ii) Contractual Necessity: The processing of your personal data is necessary for the performance of a contract between you and us. (iii) Legal Obligation: The processing of your personal data is necessary to comply with a legal obligation. (iv) Legitimate Interests: The processing of your personal data is necessary for the purposes of the legitimate interests pursued by us or by a third party, provided that your interests and fundamental rights do not override such interests. If applicable, we will transfer your personal data to third parties subject to appropriate or suitable safeguards, such as standard contractual clauses.
					</p>

					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    C- Your Subjective Data Rights
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    If you are a user in the European Economic Area or the United Kingdom, you retain certain rights under the GDPR or UK GDPR. These rights include the right to: (i) request access to and obtain a copy of your personal data; (ii) request rectification or deletion of your personal data; (iii) object to or limit the processing of your personal data; (iv) request portability of your personal data. Furthermore, if we have collected and processed your personal data with your consent, you have the right to withdraw your consent at any time.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Notwithstanding the foregoing, we cannot modify or delete information stored on a particular blockchain. This information may include transaction data (i.e. purchases, sales and transfers) relating to your blockchain wallet address and any items held by your wallet address.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    To exercise any of these rights, please contact us via our email or postal address listed in the “Contact Us” section above and specify which right you are seeking to exercise. We will respond to your request within thirty (30) days. We may request specific information from you to help us confirm your identity and process your request. Please note that we retain information as necessary to fulfill the purpose for which it was collected and we may continue to retain and use the information even after a request from the data subject in accordance with our legitimate interests, including, if necessary, to fulfill our legal obligations, resolve disputes, prevent fraud and enforce our agreements.
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    If you have any concerns with our compliance, please contact us as set forth in the “Contact Us” section above. You also reserve the right to complain to the data protection authority in your territory. You also have the right to file complaints with the local data protection authority, in the Netherlands the Dutch DPA (Autoriteit Persoonsgegevens).
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						12. International Transfers
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					We will transfer personal data from Data Subjects in the European Economic Area to countries outside the European Economic Area provided that the European Commission has adopted an adequacy decision on the basis of article 45 of the GDPR for that country, the transfer of data is allowed under the EU-US Data Privacy Framework or we have taken appropriate safeguards in accordance with article 46 of the GDPR, e.g. by executing standard contractual clauses. For more information about the international transfer of your personal data and the safeguards taken, please contact us via our email or postal address listed in the “Contact Us” section above. 
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						13. Changes to this Privacy Policy
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					NEXLABS reserves the right to revise and republish this Privacy Policy at any time. Any changes will be effective immediately upon our posting of the revised Privacy Policy. For the avoidance of doubt, your continued use of the Services indicates your agreement to the revised Privacy Policy then posted. Any changes will be communicated through the platform. 
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						14. User Rights
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					Users have the right to 
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - use the platform anonymously
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    - have total control over your private keys and funds
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						15. Contacts
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
					For questions relating to this Privacy Policy, users can contact NEXLABS through the official channels available on the website
					</p>
				</section>

				<div className="w-fit hidden xl:block h-fit pt-0 lg:pt-16">
					<Footer />
				</div>
				<div className='block xl:hidden'>
					<MobileFooterSection />
				</div>
			</main>
		</>
	)
}
