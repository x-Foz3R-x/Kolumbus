import "../style.css";

import Link from "next/link";
import GlobalNav from "@/components/layouts/global-nav";
import GlobalFooter from "@/components/layouts/global-footer";

export default function Privacy() {
  return (
    <>
      <GlobalNav />

      <main className="legal-document pt-24">
        <div className="heading">
          <div className="content-width">
            <h3>Privacy policy</h3>
            <h4>Last updated November 29, 2022</h4>
          </div>
        </div>

        <div className="module">
          <div className="content-width">
            <p>
              This privacy notice, describes how and why we might collect, store, use, and/or share (&quot;<span>process</span>&quot;) your
              information when you use our services, such as when you:
            </p>
            <ul>
              <li>
                Visit our website at <span>kolumbus.app</span>, or any website <span>under kolumbus domain</span>
              </li>
              <li>Engage with us in other related ways, including any sales, marketing, or events</li>
            </ul>
            <p>
              <span>Questions or concerns?</span> Reading this privacy notice will help you understand your privacy rights and choices. If
              you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns,
              please contact us at <span>55fozer55@gmail.com</span>.
            </p>

            <h2>TABLE OF CONTENTS</h2>
            <Link href="#general-information" className="go-to">
              1. GENERAL INFORMATION
            </Link>
            <br />
            <Link href="#data-protection-methods" className="go-to">
              2. DATA PROTECTION METHODS
            </Link>
            <br />
            <Link href="#third-party-logins" className="go-to">
              3. THIRD-PARTY LOGINS PROTECTION METHODS
            </Link>
            <br />
            <Link href="#hosting" className="go-to">
              4. HOSTING
            </Link>
            <br />
            <Link href="#your-rights" className="go-to">
              5. YOUR RIGHTS AND HOW THE DATA IS USED
            </Link>
            <br />
            <Link href="#california-rights" className="go-to">
              6. PRIVACY RIGHTS SPECIFIC FOR CALIFORNIA
            </Link>
            <br />
            <Link href="#rights-to-personal-data" className="go-to">
              7. YOUR RIGHTS TO YOUR PERSONAL DATA
            </Link>
            <br />
            <Link href="#information-in-forms" className="go-to">
              8. INFORMATION IN FORMS
            </Link>
            <br />
            <Link href="#administrator-logs" className="go-to">
              9. ADMINISTRATOR LOGS
            </Link>
            <br />
            <Link href="#essential-marketing" className="go-to">
              10. ESSENTIAL MARKETING TECHNIQUES
            </Link>
            <br />
            <Link href="#about-cookies" className="go-to">
              11. INFORMATION ABOUT COOKIE FILES
            </Link>
            <br />
            <Link href="#managing-cookies" className="go-to">
              12. MANAGING COOKIES
            </Link>
            <br />

            <h2 id="general-information">1. GENERAL INFORMATION</h2>
            <p>
              This policy applies to the website operating at the url address: <span>kolumbus.app</span>
              <br />
              The website operator and personal data administrator is: <span>Paweł Knot</span>
              <br />
              Operator’s e-mail contact address: <span>55fozer55@gmail.com</span>
              <br />
              The Operator is the Administrator of your personal data in relation to the data provided
              <span>voluntarily</span> on the Website.
            </p>
            <p>The website uses personal data for the following purposes:</p>
            <ul>
              <li>To enable user-to-user communications</li>
              <li>To present your profile to other users</li>
              <li>To display user announcements</li>
              <li>To request feedback</li>
              <li>To identify usage trends</li>
              <li>To run an internet forum</li>
              <li>To support for inquiries via the form</li>
              <li>To present an offer or information</li>
              <li>To deliver targeted advertising to you</li>
              <li>To determine the effectiveness of our marketing and promotional campaigns</li>
            </ul>
            <p>The website performs the functions of obtaining information about users and their behavior in the following way:</p>
            <ul>
              <li>Through data entered voluntarily in the forms, which are entered into the Operator’s systems</li>
              <li>By saving cookie files in end devices</li>
            </ul>

            <h2 id="data-protection-methods">2. DATA PROTECTION METHODS</h2>
            <p>
              The places of logging in and entering personal data are protected in the transmission layer (<span>SSL certificate</span>).
              Thanks to this, personal data and login details entered on the website are
              <span>encrypted on the user’s computer and can only be read on the target server</span> .
            </p>
            <p>
              <span>User passwords are stored hashed</span>. The hash function works in one direction - it is not possible to reverse its
              operation, which is now the modern standard for storing user passwords.
            </p>

            <h2 id="third-party-logins">3. THIRD-PARTY LOGINS PROTECTION METHODS</h2>
            <p>
              Our Services offer you the ability to register and log in using your third-party account details (like your Google or Apple
              logins). Where you choose to do this,{" "}
              <span>we will receive certain profile information about you from your social media provider</span>. The profile information we
              receive may vary depending on the social media provider concerned, but will often include your name, email address, friends
              list, and profile picture, as well as other information you choose to make public.
            </p>
            <p>
              We will use the information we receive
              <span>only for the purposes that are described in this privacy notice</span> or that are otherwise made clear to you on the
              relevant Services.{" "}
              <span>
                Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party
                social media provider
              </span>
              . We recommend that you review their privacy notice to understand how they collect, use, and share your personal information,
              and how you can set your privacy preferences on their sites and apps.
            </p>

            <h2 id="hosting">4. HOSTING</h2>
            <p>The website is hosted (technically maintained) on our homemade server.</p>

            <h2 id="your-rights">5. YOUR RIGHTS AND HOW THE DATA IS USED</h2>
            <p>
              In some situations, the <span>Administrator has the right to transfer your personal data to other recipients</span>, if it is
              necessary to perform the contract concluded with you or to fulfill the obligations incumbent on the Administrator. This
              applies to such groups of recipients:
            </p>
            <ul>
              <li>Authorized employees and associates who use the data to achieve the purpose of the website</li>
              <li>Companies that provide marketing services to the Administrator</li>
            </ul>
            <p>
              We will only keep your personal information <span>for as long as it is necessary</span> for the purposes set out in this
              privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal
              requirements). With regard to marketing data, the data <span>will not be processed for more than 3 years</span> . You have the
              right to request from the Administrator:
            </p>
            <ul>
              <li>Access to personal data concerning you</li>
              <li>Rectifying them</li>
              <li>Deletion</li>
              <li>Processing restrictions</li>
              <li>Data transfer</li>
            </ul>
            <p>
              You have the right to object to the processing of personal data in order to perform legally justified interests pursued by the
              Administrator, including profiling, however, the right to object will not be exercised if there are valid legitimate grounds
              for processing, interests, rights and freedoms superior to you, in particular establishing, pursuing or defending claims.
            </p>
            <p>
              <span>Providing personal data is voluntary, but necessary to operate the Website.</span>
            </p>
            <p>We may need to share your personal information in the following situations:</p>
            <ul>
              <li>
                <span>Business Transfers.</span> We may share or transfer your information in connection with, or during negotiations of,
                any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
              </li>
              <li>
                <span>When we use Google Maps Platform APIs.</span> We may share your information with certain Google Maps Platform APIs
                (e.g., Google Maps API, Places API). To find out more about Google’s Privacy Policy, please refer to this{" "}
                <Link href="https://policies.google.com/privacy" target="_blank">
                  link
                </Link>
                . We use certain Google Maps Platform APIs to retrieve certain information when you make location-specific requests.
                <span>This includes: Location; and other similar information</span>. We obtain and store on your device (&quot;cache&quot;)
                your location. You may revoke your consent anytime by contacting us at the contact details provided at the end of this
                document. The Google Maps Platform APIs that we use store and access cookies and other information on your devices.
              </li>
              <li>
                <span>Business Partners</span>. We may share your information with our business partners to offer you certain products,
                services, or promotions.
              </li>
              <li>
                <span>Other Users</span>. When you share personal information (for example, by posting comments, contributions, or other
                content to the Services) or otherwise interact with public areas of the Services, such personal information may be viewed by
                all users and may be publicly made available outside the Services in perpetuity.
              </li>
            </ul>
            <p>
              Actions may be taken in relation to you consisting in automated decision making, including profiling in order to provide
              services under the concluded contract and for the Administrator to conduct direct marketing.
            </p>
            <p>
              Personal data is not transferred from third countries within the meaning of the provisions on the protection of personal data.
              This means that <span>we do not send them outside the European Union.</span>
            </p>
            <h5>If you are located in the EU or UK, this section applies to you.</h5>
            <p>
              The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to
              process your personal information. As such, we may rely on the following legal bases to process your personal information:
            </p>
            <ul>
              <li>
                <span>Consent.</span> We may process your information if you have given us permission (e.g., consent) to use your personal
                information for a specific purpose. You can withdraw your consent at any time. Click
                <Link href="#withdraw-consent" className="go-to">
                  here
                </Link>{" "}
                to learn more.
              </li>
              <li>
                <span>Performance of a Contract.</span> We may process your personal information when we believe it is necessary to fulfill
                our contractual obligations to you, including providing our Services or at your request prior to entering into a contract
                with you.
              </li>
              <li>
                <span>Legitimate Interests.</span> We may process your information when we believe it is reasonably necessary to achieve our
                legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms. For
                example, we may process your personal information for some of the purposes described in order to:
                <ul>
                  <li>Send users information about special offers and discounts on our products and services</li>
                  <li>Develop and display personalized and relevant advertising content for our users</li>
                  <li>Analyze how our Services are used so we can improve them to engage and retain users</li>
                  <li>Support our marketing activities</li>
                  <li>Diagnose problems and/or prevent fraudulent activities</li>
                  <li>Understand how our users use our products and services so we can improve user experience</li>
                </ul>
              </li>
              <li>
                <span>Legal Obligations.</span> We may process your information where we believe it is necessary for compliance with our
                legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal
                rights, or disclose your information as evidence in litigation in which we are involved.
              </li>
              <li>
                <span>Vital Interests.</span> We may process your information where we believe it is necessary to protect your vital
                interests or the vital interests of a third party, such as situations involving potential threats to the safety of any
                person.
              </li>
            </ul>
            <h5>If you are located in Canada, this section applies to you.</h5>
            <p>
              We may process your information if you have given us specific permission (e.g., express consent) to use your personal
              information for a specific purpose, or in situations where your permission can be inferred (e.g. , implied consent). You can
              withdraw your consent at any time. Click{" "}
              <Link href="#withdraw-consent" className="go-to">
                here
              </Link>{" "}
              to learn more.
            </p>
            <p>
              In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent,
              including, for example:
            </p>
            <ul>
              <li>If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way</li>
              <li>For investigations and fraud detection and prevention</li>
              <li>For business transactions provided certain conditions are met</li>
              <li>
                If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim
              </li>
              <li>For identifying injured, ill, or deceased persons and communicating with next of kin</li>
              <li>If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse</li>
              <li>
                If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the
                information and the collection is reasonable for purposes related to investigating a breach of an agreement or a
                contravention of the laws of Canada or a province
              </li>
              <li>
                If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production
                of records
              </li>
              <li>
                If it was produced by an individual in the course of their employment, business, or profession and the collection is
                consistent with the purposes for which the information was produced
              </li>
              <li>If the collection is solely for journalistic, artistic, or literary purposes</li>
              <li>If the information is publicly available and is specified by the regulations</li>
            </ul>
            <h5 id="withdraw-consent">Withdrawing your consent</h5>
            <p>
              If we are relying on your consent to process your personal information, which may be express and/or implied consent depending
              on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by
              contacting us by using the email provided in{" "}
              <Link href="#general-information" className="go-to">
                GENERAL INFORMATION
              </Link>
              .
            </p>

            <h2 id="california-rights">6. PRIVACY RIGHTS SPECIFIC FOR CALIFORNIA</h2>
            <p>
              California Civil Code Section 1798.83, also known as the &quot;Shine The Light&quot; law, permits our users who are California
              residents to request and obtain from us, once a year and free of charge, information about categories of personal information
              (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with
              which we shared personal information in the immediately preceding calendar year. If you are a California resident and would
              like to make such a request, please submit your request in writing to us using the contact provided
              <Link href="#general-information" className="go-to">
                here
              </Link>{" "}
              and include the email address associated with your account and a statement that you reside in California.
            </p>
            <p>
              If you are under 18 years of age, reside in California, and have a registered account with Services, you have the right to
              request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us
              using the contact provided
              <Link href="#general-information" className="go-to">
                here
              </Link>{" "}
              and include the email address associated with your account and a statement that you reside in California. We will make sure
              the data is not publicly displayed on the Services,{" "}
              <span>but please be aware that the data may not be completely or comprehensively removed from all our systems</span> (e.g.
              backups, etc.).
            </p>
            <h5>CCPA Privacy Notice</h5>
            <p>The California Code of Regulations defines a &quot;resident&quot; as:</p>
            <ul>
              <li>every individual who is in the State of California for other than a temporary or transitory purpose and</li>
              <li>
                every individual who is domiciled in the State of California who is outside the State of California for a temporary or
                transitory purpose
              </li>
            </ul>
            <p>All other individuals are defined as &quot;non-residents.&quot;</p>
            <p>
              If this definition of &quot;resident&quot; applies to you, we must adhere to certain rights and obligations regarding your
              personal information.
            </p>
            <p>We have collected the following categories of personal information in the past twelve (12) months:</p>
            {/* <table>
              <tr>
                <th>Category</th>
                <th>Examples</th>
                <th>Collected</th>
              </tr>
              <tr>
                <td>A. Identifiers</td>
                <td>
                  Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier,
                  online identifier, Internet Protocol address, email address, and account name
                </td>
                <td>YES</td>
              </tr>
              <tr>
                <td>B. Personal information categories listed in the California Customer Records statute</td>
                <td>Name, contact information, education, employment, employment history, and financial information</td>
                <td>YES</td>
              </tr>
              <tr>
                <td>C. Protected classification characteristics under California or federal law</td>
                <td>Gender and date of birth</td>
                <td>YES</td>
              </tr>
              <tr>
                <td>D. Commercial information</td>
                <td>Transaction information, purchase history, financial details, and payment information</td>
                <td>YES</td>
              </tr>
              <tr>
                <td>E. Biometric information</td>
                <td>Fingerprints and voiceprints</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>F. Internet or other similar network activity</td>
                <td>
                  Browsing history, search history, online behavior, interest data, and interactions with our and other websites,
                  applications, systems, and advertisements
                </td>
                <td>NO</td>
              </tr>
              <tr>
                <td>G. Geolocation data</td>
                <td>Device location</td>
                <td>YES</td>
              </tr>
              <tr>
                <td>H. Audio, electronic, visual, thermal, olfactory, or similar information</td>
                <td>Images and audio, video or call recordings created in connection with our business activities</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>I. Professional or employment-related information</td>
                <td>
                  Business contact details in order to provide you our Services at a business level or job title, work history, and
                  professional qualifications if you apply for a job with us
                </td>
                <td>NO</td>
              </tr>
              <tr>
                <td>J. Education Information</td>
                <td>Student records and directory information</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>K. Inferences drawn from other personal information</td>
                <td>
                  Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for
                  example, an individual’s preferences and characteristics
                </td>
                <td>NO</td>
              </tr>
            </table> */}
            <p>
              We may also collect other personal information outside of these categories through instances where you interact with us in
              person, online, or by phone or mail in the context of:
            </p>
            <ul>
              <li>Receiving help through our customer support channels</li>
              <li>Participation in customer surveys or contests and</li>
              <li>Facilitation in the delivery of our Services and to respond to your inquiries</li>
            </ul>
            <p>
              We may disclose your personal information with our service providers pursuant to a written contract between us and each
              service provider. Each service provider is a for-profit entity that processes the information on our behalf.
            </p>
            <p>
              We may use your personal information for our own business purposes, such as for undertaking internal research for
              technological development and demonstration.
            </p>
            <p>
              You can designate an authorized agent to make a request under the CCPA on your behalf. We may deny a request from an
              authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with
              the CCPA.
            </p>

            <h2 id="rights-to-personal-data">7. YOUR RIGHTS TO YOUR PERSONAL DATA</h2>
            <h5>Right to request deletion of the data — Request to delete</h5>
            <p>
              You can ask for the deletion of your personal information. If you ask us to delete your personal information, we will respect
              your request and delete your personal information, subject to certain exceptions provided by law, such as (but not limited to)
              the exercise by another consumer of his or her right to free speech, our compliance requirements resulting from a legal
              obligation, or any processing that may be required to protect against illegal activities.
            </p>
            <h5>Right to be informed — Request to know</h5>
            <p>Depending on the circumstances, you have a right to know: </p>
            <ul>
              <li>Whether we collect and use your personal information</li>
              <li>The purposes for which the collected personal information is used</li>
              <li>Whether we sell your personal information to third parties</li>
              <li>
                In accordance with applicable law, we are not obligated to provide or delete consumer information that is de-identified in
                response to a consumer request or to re-identify individual data to verify a consumer request.
              </li>
            </ul>
            <h5>Right to Non-Discrimination for the Exercise of a Consumer’s Privacy Rights</h5>
            <p>We will not discriminate against you if you exercise your privacy rights. </p>
            <h5>Verification process</h5>
            <p>
              Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the
              information in our system. These verification efforts require us to ask you to provide information so that we can match it
              with information you have previously provided us. For instance, depending on the type of request you submit, we may ask you to
              provide certain information so that we can match the information you provide with the information we already have on file, or
              we may contact you through a communication method (e.g. email) that you have previously provided to us. We may also use other
              verification methods as the circumstances dictate.
            </p>
            <p>
              We will only use personal information provided in your request to verify your identity or authority to make the request. To
              the extent possible, we will avoid requesting additional information from you for the purposes of verification. However, if we
              cannot verify your identity from the information already maintained by us, we may request that you provide additional
              information for the purposes of verifying your identity and for security or fraud-prevention purposes. We will delete such
              additionally provided information as soon as we finish verifying you.
            </p>
            <br />
            <p>
              <span>
                To exercise these rights, you can contact us by email at 55fozer55@gmail.com. If you have a complaint about how we handle
                your data, we would like to hear from you.
              </span>
            </p>
            <p>
              <span>
                If you are using an authorized agent to exercise your right to opt out we may deny a request if the authorized agent does
                not submit proof that they have been validly authorized to act on your behalf.
              </span>
            </p>

            <h2 id="information-in-forms">8. INFORMATION IN FORMS</h2>
            <p>The website collects information provided voluntarily by the user, including personal data, if provided.</p>
            <p>The website may save information about connection parameters (time stamp, IP address).</p>
            <p>
              The data provided in the form is processed for the purpose resulting from the function of a specific form, e.g. to process a
              service request or registration, etc. Each time, the context and description of the form clearly informs what it is for.
            </p>

            <h2 id="administrator-logs">9. ADMINISTRATOR LOGS</h2>
            <p>
              Information about the behavior of users on the website may be subject to logging. These data are used to administer the
              website.
            </p>

            <h2 id="essential-marketing">10. ESSENTIAL MARKETING TECHNIQUES</h2>
            <p>
              The operator uses statistical analysis of website traffic through Google Analytics (Google Inc. based in the USA). The
              operator does not provide the operator of this service with personal data, but only anonymized information. The service is
              based on the use of cookies on the user’s end device. In terms of information about user preferences collected by the Google
              advertising network, the user can view and edit information resulting from cookies using the tool:
              https://www.google.com/ads/preferences/
            </p>
            <p>
              The operator uses a solution that examines the behavior of users by creating heat maps and recording behavior on the website.
              This information is anonymized before it is sent to the service operator so that he does not know which person it concerns. In
              particular, entered passwords and other personal data are not recorded.
            </p>

            <h2 id="about-cookies">11. INFORMATION ABOUT COOKIE FILES</h2>
            <p>
              The website uses <span>cookies</span>.
            </p>
            <p>
              Cookie files are IT data, in particular text files, which are stored in the <span>User’s end device</span>
              and are intended for using the <span>Kolumbus</span> websites. Cookies usually contain the name of the website they come from,
              their storage time on the end device and a unique number.
            </p>
            <p>The entity placing cookies on the User’s end device and accessing them is the Website operator.</p>
            <p>Cookies are used for the following purposes:</p>
            <ul>
              <li>
                Maintaining the Website user’s session (after logging in), thanks to which the user does not have to re-enter the login and
                password on each subpage of the Website
              </li>
              <li>
                to achieve the goals set out above in the
                <Link href="#essential-marketing" className="go-to">
                  ESSENTIAL MARKETING TECHNIQUES
                </Link>
              </li>
            </ul>
            <p>
              The Website uses two basic types of cookies: <span>session cookies</span> and
              <span>persistent cookies</span>. Session cookies are <span>temporary files</span> that are stored on the User’s end device
              until logging out, leaving the website or turning off web browser. Persistent cookies are stored on the User’s end device for
              the time specified in the cookie file parameters or until they are deleted by the User.
            </p>
            <p>
              The web browser usually <span>allows cookies</span> to be stored on the User’s end device by default. The web browser{" "}
              <span>allows you to delete cookies</span>. It is also possible to <span>automatically block cookies</span>, detailed
              information on this subject can be found in the help or documentation of the web browser.
            </p>
            <p>
              Restrictions on the use of cookies <span>may affect some of the functionalities</span> available on the Website.
            </p>
            <p>
              Cookie files placed on the User’s end device may also be used by
              <span>entities cooperating with the Website operator</span>, in particular the following companies: Google (Google Inc. based
              in the USA), Twitter (Twitter Inc. based in the USA).
            </p>

            <h2 id="managing-cookies">12. MANAGING COOKIES</h2>
            <p>
              If you do not want to receive cookies, <span>you can change your browser settings</span>. We reserve that disabling cookies
              necessary for authentication processes, security, maintaining user preferences may make it difficult, and in extreme cases{" "}
              <span>may prevent the use of websites</span>.
            </p>
            <p>In order to manage cookie settings, select the web browser you use from the list below and follow the instructions:</p>
            <ul>
              <li>
                <Link href="http://support.google.com/chrome/bin/answer.py?hl=pl&answer=95647">Chrome</Link>
              </li>
              <li>
                <Link href="http://support.mozilla.org/pl/kb/Włączanie%20i%20wyłączanie%20obsługi%20ciasteczek">Firefox</Link>
              </li>
              <li>
                <Link href="http://support.apple.com/kb/PH5042">Safari</Link>
              </li>
              <li>
                <Link href="http://help.opera.com/Windows/12.10/pl/cookies.html">Opera</Link>
              </li>
              <li>
                <Link href="https://support.microsoft.com/pl-pl/help/10607/microsoft-edge-view-delete-browser-history">Edge</Link>
              </li>
            </ul>
            <p>Mobile devices:</p>
            <ul>
              <li>
                <Link href="http://support.google.com/chrome/bin/answer.py?hl=pl&answer=95647">Android</Link>
              </li>
              <li>
                <Link href="http://support.apple.com/kb/HT1677?viewlocale=pl_PL">Safari (iOS)</Link>
              </li>
              <li>
                <Link href="http://www.windowsphone.com/pl-pl/how-to/wp7/web/changing-privacy-and-other-browser-settings">
                  Windows phone
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </>
  );
}
