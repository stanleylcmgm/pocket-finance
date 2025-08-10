# Balance Sheet Component

A comprehensive React Native component for tracking monthly income and expenses with real-time balance calculations.

## Features

### Core Functionality
- **Monthly Tracking**: View and manage transactions for any selected month
- **Real-time Calculations**: Automatic computation of Total Income, Total Expenses, and Balance
- **Transaction Management**: Add, edit, delete, and duplicate income/expense entries
- **Month Navigation**: Navigate between months with left/right arrows or month picker
- **Data Persistence**: Local storage with mock data (ready for real persistence layer)

### User Experience
- **Fast Entry**: Quick add buttons for income and expenses
- **Clear Summary**: Three summary cards showing totals with color-coded balance states
- **Easy Editing**: Tap any transaction to edit, long-press for context menu
- **Empty States**: Helpful prompts when no transactions exist for a month
- **Responsive Design**: Optimized for mobile with proper touch targets

### Data Model
- **Transactions**: Complete transaction records with amount, category, account, notes, and dates
- **Categories**: Predefined income and expense categories with icons and colors
- **Accounts**: Optional account tracking (Cash, Bank, Credit Card)
- **Currency Support**: USD formatting with extensible currency system

## Component Structure

### Main Components
- `BalanceSheet`: Main component orchestrating the entire screen
- `MonthNavigator`: Month selection with navigation arrows and picker
- `SummaryCards`: Three cards showing Income, Expenses, and Balance
- `TransactionList`: Scrollable lists of income and expense entries
- `EntryModal`: Add/Edit transaction form with validation
- `MonthPicker`: Modal for selecting specific month and year

### State Management
- **Local State**: React hooks for component state management
- **Data Flow**: Unidirectional data flow with clear update patterns
- **Optimistic Updates**: Immediate UI updates with data persistence

## Usage

### Basic Implementation
```jsx
import BalanceSheet from './components/balance-sheet';

function App() {
  return <BalanceSheet />;
}
```

### Navigation Integration
```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BalanceSheet from './components/balance-sheet';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="BalanceSheet" 
          component={BalanceSheet}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Data Structure

### Transaction Object
```typescript
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amountOriginal: number;
  currencyCode: string;
  amountConverted: number;
  fxRateToBase: number | null;
  categoryId: string;
  accountId: string | null;
  note: string | null;
  date: string; // ISO date string
  createdAt: string;
  updatedAt: string;
  attachmentUris: string[];
}
```

### Category Object
```typescript
interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string; // Ionicons name
  color: string; // Hex color
}
```

### Account Object
```typescript
interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'card' | 'other';
}
```

## Styling

### Theme System
- **Colors**: Consistent color palette for different states
- **Typography**: Scalable font system with proper hierarchy
- **Spacing**: Consistent spacing using 8px grid system
- **Shadows**: Subtle shadows for depth and hierarchy

### Responsive Design
- **Touch Targets**: Minimum 44x44pt for all interactive elements
- **Layout**: Flexible layouts that adapt to different screen sizes
- **Accessibility**: Proper contrast ratios and screen reader support

## Customization

### Adding New Categories
```javascript
// In utils/data-utils.js
export const sampleCategories = [
  // ... existing categories
  { 
    id: 'cat-new-category', 
    name: 'New Category', 
    type: 'expense', 
    icon: 'star', 
    color: '#ff6b6b' 
  }
];
```

### Custom Styling
```javascript
// In styles/balance-sheet.styles.js
export const balanceSheetStyles = StyleSheet.create({
  // Override existing styles or add new ones
  customStyle: {
    backgroundColor: '#your-color',
    borderRadius: 16,
  }
});
```

## Performance Considerations

### Optimization Strategies
- **Memoization**: useCallback for expensive operations
- **Efficient Rendering**: FlatList for large transaction lists
- **Lazy Loading**: Load data only when needed
- **Debounced Updates**: Prevent excessive re-renders

### Memory Management
- **Data Cleanup**: Proper cleanup of event listeners
- **State Optimization**: Minimal state updates
- **Component Lifecycle**: Proper useEffect dependencies

## Testing

### Unit Tests
- **Component Rendering**: Verify all components render correctly
- **State Updates**: Test state changes and data flow
- **User Interactions**: Test button presses and form submissions
- **Data Validation**: Test input validation and error handling

### Integration Tests
- **Data Flow**: Test complete user workflows
- **Navigation**: Test month navigation and modal interactions
- **Persistence**: Test data saving and loading

## Future Enhancements

### Planned Features
- **Multi-currency Support**: Foreign exchange rates and conversions
- **Recurring Transactions**: Automatic transaction creation
- **Budget Tracking**: Category-based budget limits
- **Data Export**: CSV/PDF export functionality
- **Cloud Sync**: Remote data synchronization
- **Attachments**: Receipt and document storage

### Technical Improvements
- **State Management**: Redux or Context API integration
- **Database Integration**: SQLite or Realm for local storage
- **API Integration**: REST API for remote data
- **Offline Support**: Offline-first architecture
- **Push Notifications**: Transaction reminders

## Dependencies

### Required Packages
- `react-native`: Core React Native framework
- `@expo/vector-icons`: Icon library (Ionicons)
- `react-native-gesture-handler`: Touch gesture support

### Optional Packages
- `@react-navigation/native`: Navigation framework
- `react-native-reanimated`: Advanced animations
- `expo-linear-gradient`: Gradient backgrounds

## Browser Support

- **React Native**: iOS 11+ and Android 5+
- **Web**: Modern browsers with React Native Web support
- **Expo**: Latest Expo SDK with managed workflow

## Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Run on device/simulator: `npm run ios` or `npm run android`

### Code Style
- **ESLint**: Follow project ESLint configuration
- **Prettier**: Consistent code formatting
- **TypeScript**: Type safety (when implemented)
- **Component Structure**: Follow established patterns

### Testing
- **Unit Tests**: Run with `npm test`
- **E2E Tests**: Run with `npm run test:e2e`
- **Coverage**: Maintain >80% test coverage

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, issues, or contributions:
- **Issues**: Create GitHub issue with detailed description
- **Discussions**: Use GitHub Discussions for questions
- **Contributions**: Submit pull requests with clear descriptions
- **Documentation**: Help improve this README and code comments
