/**
 * Exporting all resolvers
 */

import { NoticeMutation, NoticeQueries, NoticeSubscription } from './notice';
import { UserMutation, UserQueries, UserSubscription } from './user';
import { BookMutation, BookQueries, BookSubscription } from './book';

const rootResolver = {
  Query: {
    ...UserQueries,
    ...NoticeQueries,
    ...BookQueries
    // Add other queries here
  },
  Mutation: {
    ...UserMutation,
    ...NoticeMutation,
    ...BookMutation
    // Add other mutations here
  },
  Subscription: {
    ...UserSubscription,
    ...NoticeSubscription,
    ...BookSubscription
    // Add other subscriptions here
  }
};

export default rootResolver;
