// src/components/asset/AssetContractsDocs.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const PALETTE = {
  cardBg: '#111816',
  cardHover: '#16231E',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  border: 'rgba(52, 211, 153, 0.15)',
  infoBlue: '#38BDF8',
};

const FileTextIcon = ({ color = PALETTE.textMain }) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </Svg>
);

const ExternalLinkIcon = () => (
  <Svg
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="none"
    stroke={PALETTE.accent}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <Path d="M15 3h6v6" />
    <Path d="M10 14L21 3" />
  </Svg>
);

export const AssetContractsDocs = ({ property }: { property: any }) => (
  <>
    {/* On-Chain Smart Contract Details Section */}
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle} numberOfLines={1}>
          Blockchain Transparency
        </Text>
        <View style={styles.liveBadge}>
          <View style={styles.pulsingDot} />
          <Text style={styles.liveBadgeText}>VERIFIED</Text>
        </View>
      </View>

      <View style={styles.contractCard}>
        <View style={styles.contractRow}>
          <Text style={styles.contractLabel}>Token Contract</Text>
          <Text
            style={styles.contractValue}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {property.tokenAddress}
          </Text>
        </View>
        <View style={styles.contractDivider} />
        <View style={styles.contractRow}>
          <Text style={styles.contractLabel}>Escrow Treasury</Text>
          <Text
            style={styles.contractValue}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {property.treasuryAddress}
          </Text>
        </View>
        <View style={styles.contractDivider} />
        <View style={styles.contractRow}>
          <Text style={styles.contractLabel}>Governance DAO</Text>
          <Text
            style={styles.contractValue}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {property.governanceAddress}
          </Text>
        </View>
        <View style={styles.contractDivider} />
        <View style={styles.contractRow}>
          <Text style={styles.contractLabel}>IPFS Metadata Hash</Text>
          <Text
            style={styles.contractValue}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {property.metadataHash}
          </Text>
        </View>
      </View>
    </View>

    {/* Legal Documents & Offering Memorandum Links */}
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Compliance & Legal Vault</Text>
      {property.legalDocuments.map((doc: any, index: number) => {
        const docTitle =
          typeof doc === 'string' ? doc : doc.title || `Legal Doc ${index + 1}`;
        return (
          <TouchableOpacity
            key={index}
            style={styles.documentsButton}
            onPress={() =>
              Alert.alert(
                'Secure Vault',
                `Accessing compliance document: ${docTitle}`,
              )
            }
            activeOpacity={0.85}
          >
            <View style={styles.docIconWrapper}>
              <FileTextIcon />
            </View>
            <View style={styles.docTextContainer}>
              <Text style={styles.documentsButtonText} numberOfLines={1}>
                {docTitle}
              </Text>
              <Text style={styles.docSubText}>Audited & Encrypted PDF</Text>
            </View>
            <ExternalLinkIcon />
          </TouchableOpacity>
        );
      })}
      {property.financialDocuments.map((doc: any, index: number) => {
        const docTitle =
          typeof doc === 'string'
            ? doc
            : doc.title || `Financial Report ${index + 1}`;
        return (
          <TouchableOpacity
            key={index}
            style={styles.documentsButton}
            onPress={() =>
              Alert.alert(
                'Financial Vault',
                `Accessing financial report: ${docTitle}`,
              )
            }
            activeOpacity={0.85}
          >
            <View style={styles.docIconWrapper}>
              <FileTextIcon color={PALETTE.infoBlue} />
            </View>
            <View style={styles.docTextContainer}>
              <Text style={styles.documentsButtonText} numberOfLines={1}>
                {docTitle}
              </Text>
              <Text style={styles.docSubText}>
                Quarterly Certified Statement
              </Text>
            </View>
            <ExternalLinkIcon />
          </TouchableOpacity>
        );
      })}
    </View>
  </>
);

const styles = StyleSheet.create({
  sectionContainer: { marginBottom: 24 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: PALETTE.textMain,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
    flex: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    flexShrink: 0,
  },
  pulsingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: PALETTE.accent,
    marginRight: 5,
  },
  liveBadgeText: {
    color: PALETTE.accent,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  contractCard: {
    backgroundColor: PALETTE.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  contractRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contractLabel: {
    color: PALETTE.textMuted,
    fontSize: 11,
    fontWeight: '600',
    flex: 0.45,
  },
  contractValue: {
    color: '#34D399',
    fontSize: 11.5,
    fontWeight: '700',
    flex: 0.55,
    textAlign: 'right',
  },
  contractDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginVertical: 12,
  },
  documentsButton: {
    flexDirection: 'row',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  docIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.15)',
  },
  docTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },
  documentsButtonText: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  docSubText: {
    color: PALETTE.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },
});
