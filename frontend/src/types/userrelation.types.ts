export type RelationList = 'requested' | 'requestedBack' | 'current' | 'past' | 'wrong';

export interface Relation {
  id: number;
  userFrom: number;
  userTo: number;
  relationType?: string;
  relationState?: RelationList;
//  createdAt?: string;
//  contactName?: string;
}