'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import theme from '../../style/theme';
import Header from '../common/Header';
import Text from '../Text';

const isIOS = Platform.OS === 'ios';

class Terms extends Component {
  render() {
    const backgroundColor = this.props.backgroundColor || theme.dark;
    return (
      <View style={{ flex: 1, backgroundColor }}>
        {!isIOS && (
          <Header
            backgroundColor={theme.secondary}
            title="Terms of Service"
            navigator={this.props.navigator}
          />
        )}
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.paragraph}>
              <Text style={styles.title}>Terms and Conditions ("Terms")</Text>
            </Text>
            <Text style={styles.paragraph}>Last updated: May 17, 2018</Text>
            <Text style={styles.paragraph}>
              Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully
              before using the Futupolis mobile application and wappu.futurice.com site (the
              "Service") operated by Futurice Oy ("us", "we", or "our").
            </Text>
            <Text style={styles.paragraph}>
              Your access to and use of the Service is conditioned on your acceptance of and
              compliance with these Terms. These Terms apply to all visitors, users and others who
              access or use the Service.
            </Text>
            <Text style={styles.paragraph}>
              By accessing or using the Service you agree to be bound by these Terms. If you
              disagree with any part of the terms then you may not access the Service.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={styles.title}>Content</Text>
            </Text>
            <Text style={styles.paragraph}>
              Our Service allows you to post, link, store, share and otherwise make available
              certain information, text, graphics, videos, or other material ("Content"). You are
              responsible for the Content that you post to the Service, including its legality,
              reliability, and appropriateness.
            </Text>
            <Text style={styles.paragraph}>
              By posting Content to the Service, you grant us the right and license to use, modify,
              publicly perform, publicly display, reproduce, and distribute such Content on and
              through the Service. You retain any and all of your rights to any Content you submit,
              post or display on or through the Service and you are responsible for protecting those
              rights. You agree that this license includes the right for us to make your Content
              available to other users of the Service, who may also use your Content subject to
              these Terms.
            </Text>
            <Text style={styles.paragraph}>
              You represent and warrant that: (i) the Content is yours (you own it) or you have the
              right to use it and grant us the rights and license as provided in these Terms, and
              (ii) the posting of your Content on or through the Service does not violate the
              privacy rights, publicity rights, copyrights, contract rights or any other rights of
              any person.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={styles.title}>Accounts</Text>
            </Text>
            <Text style={styles.paragraph}>
              When you create an account with us, you must provide us information that is accurate,
              complete, and current at all times. Failure to do so constitutes a breach of the
              Terms, which may result in immediate termination of your account on our Service.
            </Text>
            <Text style={styles.paragraph}>
              You are responsible for safeguarding the password that you use to access the Service
              and for any activities or actions under your password, whether your password is with
              our Service or a third-party service.
            </Text>
            <Text style={styles.paragraph}>
              You agree not to disclose your password to any third party. You must notify us
              immediately upon becoming aware of any breach of security or unauthorized use of your
              account.
            </Text>
            <Text style={styles.paragraph}>
              You may not use as a username the name of another person or entity or that is not
              lawfully available for use, a name or trade mark that is subject to any rights of
              another person or entity other than you without appropriate authorization, or a name
              that is otherwise offensive, vulgar or obscene.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={styles.title}>Links To Other Web Sites</Text>
            </Text>
            <Text style={styles.paragraph}>
              Our Service may contain links to third-party web sites or services that are not owned
              or controlled by Futurice Oy.
            </Text>
            <Text style={styles.paragraph}>
              Futurice Oy has no control over, and assumes no responsibility for, the content,
              privacy policies, or practices of any third party web sites or services. You further
              acknowledge and agree that Futurice Oy shall not be responsible or liable, directly or
              indirectly, for any damage or loss caused or alleged to be caused by or in connection
              with use of or reliance on any such content, goods or services available on or through
              any such web sites or services.
            </Text>
            <Text style={styles.paragraph}>
              We strongly advise you to read the terms and conditions and privacy policies of any
              third-party web sites or services that you visit.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={styles.title}>Termination</Text>
            </Text>
            <Text style={styles.paragraph}>
              We may terminate or suspend your account immediately, without prior notice or
              liability, for any reason whatsoever, including without limitation if you breach the
              Terms.
            </Text>
            <Text style={styles.paragraph}>
              Upon termination, your right to use the Service will immediately cease. If you wish to
              terminate your account, you may simply discontinue using the Service.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={styles.title}>Limitation Of Liability</Text>
            </Text>
            <Text style={styles.paragraph}>
              In no event shall Futurice Oy, nor its directors, employees, partners, agents,
              suppliers, or affiliates, be liable for any indirect, incidental, special,
              consequential or punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses, resulting from (i) your access to or
              use of or inability to access or use the Service; (ii) any conduct or content of any
              third party on the Service; (iii) any content obtained from the Service; and (iv)
              unauthorized access, use or alteration of your transmissions or content, whether based
              on warranty, contract, tort (including negligence) or any other legal theory, whether
              or not we have been informed of the possibility of such damage, and even if a remedy
              set forth herein is found to have failed of its essential purpose.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={styles.title}>Disclaimer</Text>
            </Text>
            <Text style={styles.paragraph}>
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS"
              and "AS AVAILABLE" basis. The Service is provided without warranties of any kind,
              whether express or implied, including, but not limited to, implied warranties of
              merchantability, fitness for a particular purpose, non-infringement or course of
              performance.
            </Text>
            <Text style={styles.paragraph}>
              Futurice Oy its subsidiaries, affiliates, and its licensors do not warrant that a) the
              Service will function uninterrupted, secure or available at any particular time or
              location; b) any errors or defects will be corrected; c) the Service is free of
              viruses or other harmful components; or d) the results of using the Service will meet
              your requirements.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={styles.title}>Governing Law</Text>
            </Text>
            <Text style={styles.paragraph}>
              These Terms shall be governed and construed in accordance with the laws of United Arab
              Emirates, without regard to its conflict of law provisions.
            </Text>
            <Text style={styles.paragraph}>
              Our failure to enforce any right or provision of these Terms will not be considered a
              waiver of those rights. If any provision of these Terms is held to be invalid or
              unenforceable by a court, the remaining provisions of these Terms will remain in
              effect. These Terms constitute the entire agreement between us regarding our Service,
              and supersede and replace any prior agreements we might have between us regarding the
              Service.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={styles.title}>Changes</Text>
            </Text>
            <Text style={styles.paragraph}>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any
              time. Changes to these Terms of Service shall enter into force after they have been
              published on this site.
            </Text>
            <Text style={styles.paragraph}>
              By continuing to access or use our Service after those revisions become effective, you
              agree to be bound by the revised terms. If you do not agree to the new terms, please
              stop using the Service.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={styles.title}>Contact Us</Text>
            </Text>
            <Text style={styles.paragraph}>
              If you have any questions about these Terms, please contact us via email
              futupolisapp@gmail.com. Postal address: Kelloportinkatu 1 D, 33100 Tampere.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.transparent,
  },
  content: {
    padding: isIOS ? 15 : 20,
    paddingTop: isIOS ? 40 : 20,
    paddingBottom: 50,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 15,
    color: theme.stable,
  },
  title: {
    color: theme.orange,
    fontSize: 16,
    fontWeight: 'normal',
  },
});

export default Terms;
