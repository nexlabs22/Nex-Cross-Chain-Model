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

export default function TermsAndConditions() {
	const { mode } = useLandingPageStore()

	return (
		<>
			<Head>
				<title>Nex Labs - Terms & Conditions</title>
				<meta name="description" content="Nex Labs is reinventing trading with the cutting-edge trade page. Seamlessly swap, trade and invest in innovative indices, and access unique products - all integrated with your wallet for smooth trading." />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main
				className={`m-0 min-h-screen h-fit w-screen ${mode == 'dark' ? 'text-[#F2F2F2] bg-gradient-to-tl from-[#050505] to-[#050505]' : 'text-[#2A2A2A] bg-whiteBackground-500'
					} p-0 overflow-x-hidden`}
			>

				<DappNavbar />
				<section className="w-screen h-fit flex flex-col items-stretch justify-start px-4 lg:px-10 pt-10 pb-12">
					<h5 className={` text-4xl interBold mb-6 ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>Terms & Conditions</h5>
					
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						1. General
					</p>
                    <p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    These terms and conditions ({'"'}Terms{'"'}) govern the use of the Site (defined below) and the Services (defined below). These Terms also include any guidelines, announcements, additional terms, policies, and disclaimers made available or issued by us from time to time. These Terms constitute a binding and enforceable legal contract between Nex Labs B.V. and its affiliates ({'"'}Nex Labs{'"'}, {'"'}we{'"'}, or {'"'}us{'"'}) and you, an end user ({'"'}you{'"'} or {'"'}User{'"'}) of the services provided by us at <Link className=' underline text-blue-600' href={"https://www.nexlabs.io/"} target='_blank'>https://www.nexlabs.io </Link> ({'"'}Services{'"'}). By accessing, using, or clicking on our website https://www.nexlabs.io/ (and all related subdomains) or its mobile applications ({'"'}Site{'"'}) or accessing, using or attempting to use the Services, you agree that you have read, understood, and are bound by these Terms and that you comply with the requirements listed herein. 
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    IF YOU DO NOT AGREE TO ALL THESE TERMS OR DO NOT COMPLY WITH THE REQUIREMENTS HEREIN, YOU MUST NOT ACCESS OR USE THE SITE OR THE SERVICES. 
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    In addition, when using some features of the Services, you may be subject to specific additional terms and conditions applicable to those features. We may modify, suspend, or discontinue the Site or the Services at any time and without notifying you. We note that these Terms between you and us do not enumerate or cover all rights and obligations of each party, and do not guarantee full alignment with needs arising from future development. Therefore, our privacy policy which can be viewed at the {'"'}Privacy Policy{'"'} link at the bottom of our Site, platform rules, guidelines and all other agreements entered into separately between you and us are deemed supplementary terms that are an integral part of these Terms and shall have the same legal effect. Your use of the Site or the Services is deemed your acceptance of any supplementary terms too. 
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    DISCLAIMER FOR US USERS: PLEASE BE ADVISED THAT, IN ACCORDANCE WITH INTERNATIONAL REGULATIONS AND THE LAW IN FORCE IN THE UNITED STATES OF AMERICA, OUR SITE DOES ACCEPT CLIENTS RESIDENT IN THE USA (For further information, please see: <Link className=' underline text-blue-600' href={"/us_disclaimer"} target='_blank'>US Users Disclaimer</Link>) 
					</p>
                    <p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Should you have any questions concerning these Terms, please contact us at <Link className=' underline text-blue-600' href={"mailto:nexlabs.info@gmail.com"} target="_blank">nexlabs.info@gmail.com</Link> . 
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						2. Modification of Terms
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    We reserve the right to change, update, add or remove the provisions of these Terms from time to time. We will date and post the most current version of these Terms on the Site. Any changes will be effective upon posting the revised version of these Terms (or such later effective date as may be indicated at the top of the revised Terms). If in our sole discretion we deem a revision to these Terms to be material, we will notify you via the Site and/or by email to the email address associated with your account.  
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    We encourage you to check the date of these Terms whenever you visit the Site to see if these Terms have been updated. Your continued access or use of the Site or the Services (or any part of the Site or the Services) constitutes your acceptance of such changes. If you do not agree to any of the changes, we are not obligated to keep providing the Site or the Services, and you must cancel and stop using the Site or the Services.  
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						3. Site
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    As part of the Site and the Services, Nex Labs provides access to a decentralized finance spot index standard model (“Model”) on the Ethereum Virtual Machine (EVM) compatible blockchain, that harnesses holding tokens to symbolize diverse assets. This Model enables investors to diversify their portfolios by investing in an asset index rather than a single cryptocurrency. Once the holding token is minted, users have the option to trade the holding token on various exchanges outside the Model. Using the Model may require that you pay fees to complete a transaction. You acknowledge and agree that Nex Labs has no control over any smart contract, transactions, the method of payment of any transactions, or any actual payments of transactions. You must ensure that you have a sufficient balance of the applicable cryptocurrency tokens stored at your Model-compatible wallet address (“Wallet”) to complete any transaction on the Model or the EVM blockchain before initiating such transaction.   
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						4. Access To The Site
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    The Site, the Services and access to the Site is provided “as is” and “as available” basis only. By using the Site and the Services, you acknowledge and agree that: (a) you have not relied upon any other statement or agreement, whether written or oral, with respect to your use of and access to the Site and the Services; (b) access may be interrupted, suspended or restricted, including because of a fault, error, unforeseen circumstances or because we are carrying out planned maintenance; (c) we cannot guarantee that the Site, or any content on it, will be available or uninterrupted, secure or free of bugs, errors or omissions; (d) we may remove or amend the content of the Site at any time; and (e) we are under no obligation to update the content of the Site.   
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    As a condition to accessing or using the Site and the Services, you agree that you will: (1) only use the Site and the Services for lawful purposes and in accordance with these Terms; (2) ensure that all information that you provide on the Site is current, complete, and accurate; and (3) maintain the security and confidentiality of access to your Wallet.   
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    We reserve the right to limit the availability of the Site and the Services to any person, geographic area or jurisdiction or to terminate your access to and use of the Site and the Services, at any time and in our sole discretion.    
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						5. Risks in Using the Site and Digital Assets
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    By making use of the Site and the Services, you acknowledge and agree that: (a) you are aware of the risks associated with transactions of encrypted or digital assets, digital tokens or cryptocurrencies with a certain value that are based on blockchain, distributed ledger technologies and cryptography technologies and are issued and managed in a decentralized form (”Digital Assets”); (b) you shall assume all risks related to the use of the Site and the Services and transactions of Digital Assets; (c) the values of Digital Assets are volatile and may fluctuate significantly and there is a substantial risk of economic loss when purchasing, holding or investing in Digital Assets; (d) your access to your holding tokens may be suspended or terminated; (e) there may be a delay in your access or use of your holding tokens which may result in the holding tokens diminishing in value or you being unable to complete a transaction; (f) if you are a borrower of holding tokens and if your collateral declines such that your collateral is no longer sufficient to secure your borrowed holding tokens, your collateral may be executed upon, which could result in a total loss of your holding tokens; (g) Nex Labs shall not be liable for any such risks or adverse outcomes and (h) you expressly waive and release Nex Labs from any and all liability, claims, causes of action, or damages arising from or in any way related to your use of the Site or the Services .    
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						6. Restrictions
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    You shall not use the Site or the Services in any manner except as expressly permitted in these Terms. Without limiting the generality of the preceding sentence, you undertake that you will NOT and will NOT encourage or assist any third-party to:     
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    a. modify, alter, tamper with, repair or otherwise create derivative works of any software used software used to provide or access the Site or the Services;      
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    b. reverse engineer, disassemble or decompile the software used to provide or access the Site or the Services, or attempt to discover or recreate the source code used to provide or access the Site or the Services, except and only to the extent that the applicable law expressly permits doing so;      
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    c. use the Site or the Services in any manner or for any purpose other than as expressly permitted by these Terms, the Privacy Policy, or any other policy, instruction or terms applicable to the Site or the Services that are available on the Site ({'"'}Policies{'"'});       
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    d. sell, lend, rent, resell, lease, sublicense or otherwise transfer any of the rights granted to you with respect to the Site and Services to any third-party;       
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    e. remove, obscure or alter any proprietary rights notice pertaining to the Site or the Services;        
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    f. access or use the Site or the Services in a way intended to improperly avoid incurring fees or exceeding usage limits or quotas;        
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    g. use the Site or the Services in connection with the operation of facilities, systems, devices, or in any other manner in which the failure of the Site or the Services could lead to death, personal injury, or physical property or environmental damage;        
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    h. use the Site or the Services to: (i) engage in any unlawful or fraudulent activity or perpetrate a hoax or engage in phishing schemes or forgery or other similar falsification or manipulation of data; (ii) send unsolicited or unauthorized junk mail, spam, chain letters, pyramid schemes or any other form of duplicative or unsolicited messages, whether commercial or otherwise; (iii) store or transmit inappropriate content, such as content: (1) containing unlawful, defamatory, threatening, pornographic, abusive, libelous or otherwise objectionable material of any kind or nature, (2) containing any material that encourages conduct that could constitute a criminal offense, or (3) in a way that violates or infringes upon the intellectual property rights or the privacy or publicity rights of any person or entity or that may otherwise be unlawful or give rise to civil or criminal liability; (4) store or transmit any content that contains or is used to initiate a denial of service attack, software viruses or other harmful or deleterious computer code, files or programs such as Trojan horses, worms, time bombs, cancelbots, or spyware; or (5) abuse, harass, stalk or otherwise violate the legal rights of a third-party;        
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    i. interfere with or disrupt servers or networks used by Nex Labs to provide the Site or the Services or used by other users to access the Site or the Services, or violate any third-party regulations, policies or procedures of such servers or networks or harass or interfere with another user{"'"}s full use and enjoyment of any software or the Site or the Services;        
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    j. access or attempt to access Nex Labs’ other accounts, computer systems or networks not covered by these Terms, through password mining or any other means;        
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    k. cause, in Nex Labs’ sole discretion, inordinate burden on the Site or the Services or Nex Labs’ system resources or capacity;        
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    l. share passwords or other access information or devices or otherwise authorize any third-party to access or use the software or the Site or the Services;        
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    m. use the Site or the Services in any dishonest or unlawful manner, for fraudulent or malicious activities, or in any manner inconsistent with these Terms;         
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    n. violate any applicable law, including, without limitation, any relevant and applicable anti-money laundering and anti-terrorist financing laws and any relevant and applicable privacy and data collection laws, in each case as may be amended;          
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    o. infringe on or misappropriate any contract, intellectual property rights, third-party right, any proprietary rights, including but not limited to copyrights, patents, trademarks, or trade secrets of Nex Labs or commit a tort while using the Site or the Services;           
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    p. use the Site or the Services to transmit any data or send or upload any material that contains malwares, viruses, Trojan horses, worms, time-bombs, keystroke loggers, spyware, adware, drop-dead devices, backdoors, shut down mechanisms or any other harmful programmes or computer code designed to adversely affect the operation of any computer software or hardware;            
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    q. use any deep linking, robots, web crawlers, bots, spiders, scrapers or other automatic devices, programs, scripts, algorithms or methods, or any similar or equivalent manual processes to access, obtain, copy, monitor, replicate or bypass the Site or the Services that is not provided by us, to access the Site or Service to extract date;           
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    r. make any back-up or archival copies of the Site or the Services or any part thereof, including disassembling or de-compilation of the Site or the Services;            
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    s. violate public interests, public morals, or the legitimate interests of others, including any actions that would interfere with, disrupt, negatively affect, or prohibit other users from using the Services;             
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    t. use the Services for market manipulation (such as pump and dump schemes, wash trading, self-trading, front running, quote stuffing, and spoofing or layering, regardless of whether prohibited by law);              
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    u. attempt to access any part or function of the Site or the Services without authorization, or connect to the Site or the Services or any Nex Labs servers or any other systems or networks of any the Services provided through the services by hacking, password mining or any other unlawful or prohibited means;               
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    v. attempt to circumvent any content filtering techniques or security measures that Nex Labs employs on the Site or the Services, or attempt to access any area of the Site or the Services that you are not authorized to access;                
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    w. probe, scan or test the vulnerabilities of the Site, Services or any network connected to the properties, or violate any security or authentication measures on the Site, Services or any network connected thereto;                 
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    x. reverse look-up, track or seek to track any information of any other Users or visitors of the Site or the Services;                  
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    y. use any devices, software or routine programs to interfere with the normal operation of any transactions of the Site or the Services, or any other person’s use of the Site or the Services;                  
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    z. export, reexport, or transfer, directly or indirectly, any Nex Labs technology in violation of applicable export laws or regulations;                   
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    aa. use the Site or the Services in any manner that could interfere with, disrupt, negatively affect, or inhibit other users from fully enjoying the Site or the Services, or that could damage, disable, overburden, or impair the functioning of the Site or the Services in any manner;                    
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    bb. post content or communications on the Site or the Services that are, in our sole discretion, libelous, defamatory, profane, obscene, pornographic, sexually explicit, indecent, lewd, vulgar, suggestive, harassing, hateful, threatening, offensive, discriminatory, bigoted, abusive, inflammatory, fraudulent, deceptive or otherwise objectionable;                     
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    cc. post content on the Site or the Services containing unsolicited promotions, commercial messages or any chain messages or user content designed to deceive or trick the user of the Site or the Services;                      
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    dd. encourage or induce any third-party to engage in any of the activities prohibited under these Terms; or                      
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    ee. forge headers, impersonate, or otherwise manipulate identification, to disguise your identity or the origin of any messages or transmissions you send to Nex Labs or the Site or the Services.                       
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    By accessing the Site or the Services, you agree that we have the right to investigate any violation of these Terms, unilaterally determine whether you have violated these Terms, and take actions under relevant regulations without your consent or prior notice.  
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						7. Fees
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    For providing the Site and the Services, allowing you access to the Site and the Services Nex Labs may charge you fees, including, but not limited to, a management fee, a bridge fee, and a fiat on/off ramp fee. The current applicable fees can be accessed through our Site or found in our GitBook <Link className=' underline text-blue-600' href={"https://nex-labs.gitbook.io/nex-dex"} target='_blank'>(https://nex-labs.gitbook.io/nex-dex)</Link> , however, the fees charged by the Model when using the Site and the Services are leading.   
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						8. Termination
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Nex Labs reserves the right, to temporarily suspend or terminate your access to the Site or the Services at any time in our sole discretion, with or without cause, with or without notice, and without incurring liability of any kind.    
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Upon termination of your access to the Site or the Services, these Terms shall terminate, except for those clauses that expressly or are intended to survive termination or expiry.    
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						9. Disclaimers
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    The Site and the Services are provided on an {'"'}as is{'"'} and {'"'}as available{'"'} basis without any representation or warranty, whether express, implied or statutory.     
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    You understand and agree that we are not liable to you for any loss or damage you may suffer as a result of the Site being unavailable at any time for any reason.      
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Nex Labs does not make any representations or warranties that access to the Site, any part of the Services, including mobile services, or any of the materials contained therein, will be continuous, uninterrupted, timely, or error-free and will not be liable for any losses relating thereto. Nex Labs does not represent or warrant that the Site, the Services or any materials of Nex Labs are accurate, complete, reliable, current, error-free, or free of viruses or other harmful components. Nex Labs will not be liable to you or to any third-party for any termination, suspension, or modification of your access to the Site or the Services.      
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    To the extent permitted by applicable law, none of Nex Labs or its respective agents, attorneys, contractors, directors, distribution partners, employees, members, officers, parents, partners, representatives, shareholders, successors or suppliers will be liable for any direct, indirect, special, incidental, intangible, consequential or exemplary for losses or damages, including but not limited to loss of profits or opportunities, business interruption and reputational damage (even if we have been advised of the possibility of such losses or damages), arising out of, relating to, or in any way connected with: (a) any performance of non-performance of the Site, the Services, these Terms or any other product, service or other item provided by or on behalf of Nex Labs; (b) any authorized or unauthorized use of the Site or the Services, or in connection with these Terms; (c) any inaccuracy, defect or omission of any data or information on the Site or the Services; (d) any error, delay or interruption in the transmission of such data; (e) any actions, omissions or violations of these Terms by any third parties; or (f) any illegal actions of (other) third parties or actions without authorization by Nex Labs. Even if Nex Labs knew or should have known of the possibility of such damages and notwithstanding the failure of any agreed or other remedy of its essential purpose, except to the extent of a final judicial determination that such damages were a result of our gross negligence, actual fraud, willful misconduct or intentional violation of law or except in jurisdictions that do not allow the exclusion or limitation of incidental or consequential damages.       
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    To the extent permitted by applicable law, Nex Labs specifically disclaims any implied warranties of title, merchantability, fitness for a particular purpose and/or non-infringement.       
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Nex Labs disclaims any liability for the services and products offered by third parties on the Site or via hyperlinks on the Site. Nex Labs only provides the Site as a platform for third parties offering such services and products and Nex Labs neither endorses such services and products, nor has verified the legality, quality or appropriateness of these third parties and the services and products offered by them. If you have any complaints about these third parties and the services and products offered by them, including complaints about intellectual property infringements, you may contact us at <Link className=' underline text-blue-600' href={"mailto:nexlabs.info@gmail.com"} target="_blank">nexlabs.info@gmail.com</Link>.       
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Nex Labs makes no warranty as to the merit or juridical nature of any holding token in our Model in connection with our Services (including whether or not it is considered a crypto-asset, utility token, asset referenced token, security or financial instrument under the any applicable (financial) regulatory laws).      
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    The Model is fully decentralized which means that Nex Labs does not own the funds of the Users and is not responsible for the functioning of the smart contracts of the Model. Nexlabs is not responsible for any loss or damages to the funds of the Users or the functioning of the smart contracts of the Model and the possible consequences of the (non) functioning of these smart contracts.       
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Nex Labs disclaims any liability regarding the management and storage of private and public cryptographic keys. Users are personally responsible for the management of their cryptographic keys.        
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Notwithstanding anything to the contrary contained herein, in no event shall the cumulative liability of Nex Labs and its respective agents, attorneys, contractors, directors, distribution partners, employees, members, officers, parents, partners, representatives, shareholders, successors or suppliers exceed the greater of (i) what Nex Labs can recover under insurance, (ii) the total payments received from you by us during the preceding twelve (12) month period, or (iii) €100. Furthermore, you agree that any cause of action arising out of, relating to, or in any way connected with any of the Site, the Services or these Terms must commence within one (1) year after the cause of action accrues; otherwise, such cause of action shall be permanently barred. These limitations shall apply to the fullest extent permitted by law.         
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						10. Third-Party Website Disclaimer
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Any hyperlink or reference to third-party websites in or referred to on our Site or the Services does not imply endorsement or warranty by us of any product, service, information, or disclaimer presented therein, nor do we guarantee or are we responsible for the accuracy, timeliness, completeness or reliability of the information or any opinion, advice or statement made on the Site by us. If you suffer a loss from using such third-party product and service, we will not be liable and cannot be held liable for such loss. In addition, since we have no control over the terms of use or privacy policies of third-party websites, you should carefully read and understand those policies.          
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						11. Intellectual Property
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    All present and future copyright, title, interests in and to the Site and the Services, registered and unregistered trademarks, patents, design rights, unregistered designs, database rights and all other present and future intellectual property rights and rights in the nature of intellectual property rights that exist in or in relation to the use and access of the Site and the Services are owned by or otherwise licensed to Nex Labs. Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable, and revocable license to merely use or access the Site and the Services for your personal, non-commercial use only. Except as expressly stated in these Terms, nothing in these Terms should be construed as conferring any right in or license to our or any other third-party’s intellectual property rights. If and to the extent that any such intellectual property rights are vested in you by operation of law or otherwise, you agree to do any and all such acts and execute any and all such documents as we may reasonably request in order to assign such intellectual property rights back to us. You agree and acknowledge that all content on the Site and the Services must not be copied or reproduced, modified, redistributed, used, created for derivative works, or otherwise dealt with for any other reason without being granted a prior written consent from us. Third parties participating on the Site or the Services may permit us to utilize trademarks, copyrighted material, and other intellectual property associated with their businesses. We will not warrant or represent that the content of the Site or the Services does not infringe the rights of any third-party.          
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Nex Labs may have patents, patent applications, trademarks, copyrights, or other intellectual property rights covering subject matter that is part of the Site or the Services. Unless we have granted you licenses to our intellectual property in these Terms, us providing you with the Site or the Services does not give you any license to our intellectual property. Any rights not expressly granted herein are reserved.          
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						12. Privacy
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    When you visit the Site or use the Service we, or third-party contractors and licensors, may collect personal data about you and your organisation(s).  The personal data that we, or third-party contractors and licensors, collect is in principle limited to the information that a User provides, and includes e.g. names, contact information, message content, wallet addresses and usage information.          
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    As part of the Site or the Services, we or contractors or licensors may also automatically upload information about your computer or device, your use of the Site or the Services, and Site performance. We use and protect that information as described in Nex Labs’ applicable Privacy Policy, as published on this website <Link className=' underline text-blue-600' href="/privacy_policy" target='_blank'>(Privacy Policy)</Link>.          
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    You acknowledge and agree that we may access or disclose information about you, in order to: (a) comply with the law or respond to lawful requests or legal process; (b) protect the rights of Nex Labs, including the enforcement of our agreements or policies governing your use of the Site and Services; or (c) act on a good faith belief that such access or disclosure is necessary to protect the personal safety of Nex Labs’ employees, customers, or the public.          
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    We retain the right to block or otherwise prevent delivery of any type of file, email or other communication to or from the Site or the Services as part of our efforts to protect the Site or the Services, protect our customers, or stop you from breaching these Terms.          
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						13. Representations and Warranties
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    You represent and warrant that:          
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    a. any factual information provided by you to Nex Labs ({'"'}Information{'"'}) is true and accurate in all respects as at the date it is provided or as at the date (if any) at which it is stated;                 
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    b. nothing has occurred or been omitted and no information has been given or withheld that results in the Information being untrue or misleading in any material respect; and                 
					</p>
					<p className={` text-lg ml-4 leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    c. any financial projections contained in the Information have been prepared in good faith on the basis of recent historical information and on the basis of reasonable assumptions.                 
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    The representations and warranties set out above and elsewhere in these Terms are deemed to be made by you daily by reference to the facts and circumstances then existing commencing on the date of this letter and continuing until the termination of your use of the Site and the Services.          
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    You shall immediately notify Nex Labs in writing if any representation and warranty set out above and elsewhere in these Terms is incorrect or misleading and agree to supplement the Information promptly from time to time to ensure that each such representation and warranty is correct when made.          
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    You acknowledge that Nex Labs will be relying on the Information without carrying out any independent verification.          
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						14. Independent Parties
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Nex Labs is an independent contractor but not an agent of you in the performance of these Terms. These Terms shall not be interpreted as facts or evidence of an association, joint venture, partnership or franchise between you and us.          
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						15. Indemnification
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    You agree to indemnify and hold harmless Nex Labs and its respective shareholders, members, directors, officers, employees, attorneys, agents, representatives, suppliers or contractors from and against any potential or actual claims, actions, proceedings, investigations, demands, suits, costs, expenses and damages (including attorneys’ fees, fines or penalties imposed by any regulatory authority) arising out of or related to: (a) your use of, or conduct in connection with, the Site or the Services; (b) your breach or our enforcement of these Terms; or (c) your violation of any applicable law, regulation, or rights of any third-party during your use of the Site or the Services. If you are obligated to indemnify Nex Labs and its respective shareholders, members, directors, officers, employees, attorneys, agents, representatives, suppliers or contractors pursuant to these Terms, Nex Labs will have the right, in its sole discretion, to control any action or proceeding and to determine whether Nex Labs wishes to settle, and if so, on what terms. Your obligations under this indemnification provision will continue even after these Terms have expired or been terminated.          
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						16. Marketing
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    You agree that Nex Labs may use your (pre-approved) name and logo(s) for marketing and promotional materials. You grant Nex Labs the right to link to your website. You agree to use reasonable efforts to arrange for appropriate personnel to be available to serve as references for the Site and Services and Nex Labs in the event of an inquiry from any member of the press, any industry analysts or any potential customer. You agree to reasonably cooperate with Nex Labs to prepare a case study/reference testimonial about the Site or the Services.          
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						17. Confidentiality
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    You agree that Nex Labs may use your (pre-approved) name and logo(s) for marketing and promotional materials. You grant Nex Labs the right to link to your website. You agree to use reasonable efforts to arrange for appropriate personnel to be available to serve as references for the Site and Services and Nex Labs in the event of an inquiry from any member of the press, any industry analysts or any potential customer. You agree to reasonably cooperate with Nex Labs to prepare a case study/reference testimonial about the Site or the ServicesYou acknowledge that the Site and the Services contain trade secrets of, and confidential information about, Nex Labs. You agree to use the Site and hold and maintain the Services in confidence, and not to furnish any other person any confidential information about the Site and Services. You agree to use a reasonable degree of care to protect the confidentiality of the Site and Services. You will not remove or alter any proprietary notices of Nex Labs. Your obligations under this provision will continue even after these Terms have expired or been terminated..          
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						18. Anti-Money Laundering
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Nex Labs expressly prohibits and rejects the use of the Site or the Services for any form of illicit activity, including money laundering, terrorist financing or trade sanctions violations. By using the Site or the Services, you represent that you are not involved in any such activity. In case we, in our sole discretion, suspect or conclude that you have used the Site or the Services for any of form of illicit activity, we are entitled to terminate and cancel the use of the Site or the Services with immediate effect and to inform any (governmental) authority thereof.          
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						19. Force
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Nex Labs shall have no liability to you if it is prevented from or delayed in performing its obligations or from carrying on its Services and business, by acts, events, omissions or accidents beyond its reasonable control, including, without limitation, strikes, failure of a utility service or telecommunications network, act of God, war, riot, civil commotion, malicious damage, compliance with any law or governmental order, rule, regulation, or direction.          
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						20. Governing Law and Jurisdiction 
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    These Terms (including this Clause 22) and any non-contractual obligations, dispute or claim arising out of or in connection with these Terms, the Site or the Services shall in each case be governed by, and construed in accordance with, the laws of the Netherlands.           
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    Each party shall attempt in good faith to mutually resolve any and all disputes or claims, whether of law or fact, and of any nature whatsoever arising from or with respect to these Terms, the Site or the Services. Any dispute or claim that is not resolved after good faith negotiations may be referred by either party for final, binding resolution by arbitration under the arbitration rules of the Dutch Foundation for Consumer Complaints Boards (De Geschillencommissie <Link className=' underline text-blue-600' href={"https://www.degeschillencommissie.nl/english/"} target='_blank'>https://www.degeschillencommissie.nl/english/</Link>). The laws of the Netherlands shall be the law applicable to the arbitration. The seat of arbitration shall be Amsterdam, the Netherlands. The number of arbitrators shall be one (1). The arbitration proceedings shall be conducted in English.           
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						21. Severability
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    If any provision of these Terms is determined by any court or other competent authority to be unlawful or unenforceable, the other provisions of these Terms will continue in effect. If any unlawful or unenforceable provision would be lawful or enforceable if part of it were deleted, that part will be deemed to be deleted, and the rest of the provision will continue in effect (unless that would contradict the clear intention of the clause, in which case the entirety of the relevant provision will be deemed to be deleted).           
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						22. Notices
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    All notices, requests, demands, and determinations for us under these Terms (other than routine operational communications) shall be sent to <Link className=' underline text-blue-600' href={"mailto:nexlabs.info@gmail.com"} target="_blank">nexlabs.info@gmail.com</Link>.           
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						23. Assignment
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    You may not assign, transfer or encumber any right to use the Services or any of your rights or obligations under these Terms without prior written consent from us, including any right or obligation related to the enforcement of laws or the change of control. We may assign, transfer or encumber any or all of its rights or obligations under these Terms, in whole or in part, at our sole discretion, without notice or obtaining your consent or approval, to any person or third-party, including third-party contractors and licensors.           
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						24. Third-Party Rights
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    No third-party shall have any right to exercise or enforce any term or condition contained herein. If a third-party has a right to exercise or enforce any term or condition contained herein, these Terms may be amended, supplemented, restated or waived without that third-party’s consent.           
					</p>

					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
						25. Miscellaneous
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    We may perform any of our obligations, and exercise any of the rights granted to us under these Terms, through a third-party at our sole discretion.           
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    No waiver by either party of any breach or default hereunder shall be deemed to be a waiver of any preceding or subsequent breach or default.            
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    The section headings used herein are for convenience only and shall not be given any legal import.             
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    All disclaimers, indemnities and exclusions in these Terms shall survive termination of the Terms and shall continue to apply during any suspension or any period during which the Site or the Services are not available for you to use for any reason whatsoever.              
					</p>
					<p className={` text-lg leading-normal mt-4 xl:w-11/12 lg:text-justify interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}`}>
                    These Terms and the documents referred to in them set out the entire agreement between you and us with respect to your use of the Site, Nex Labs and the Services provided via the Site and supersede any and all prior or contemporaneous representations, communications or agreements (written or oral) made between you or us.              
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
