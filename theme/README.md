# Theme System Documentation

This theme system follows industrial standards for React Native applications, providing a scalable and maintainable approach to styling.

## 🎨 Design System Overview

The theme system is organized into four main categories:

### 1. Colors (`theme/colors.js`)
- **Semantic naming**: Colors are named by their purpose, not their appearance
- **Color scales**: Each color has multiple shades (50-900) for flexibility
- **Organized categories**: Primary, secondary, success, warning, error, info, neutral
- **Feature-specific colors**: Dedicated colors for specific app features

### 2. Spacing (`theme/spacing.js`)
- **Consistent scale**: Based on 4px grid system
- **Semantic values**: Named spacing values for common use cases
- **Border radius**: Consistent radius values
- **Gaps**: Standardized gap values for layouts

### 3. Typography (`theme/typography.js`)
- **Font sizes**: Consistent scale from xs to display
- **Font weights**: Standard weight values
- **Line heights**: Optimized for readability
- **Predefined styles**: Common text styles ready to use

### 4. Shadows (`theme/shadows.js`)
- **Elevation levels**: Consistent shadow system
- **Platform-specific**: Optimized for both iOS and Android
- **Semantic naming**: Named by purpose (card, button, navigation)

## 🚀 Usage Examples

### Basic Usage
```javascript
import { theme } from '../theme';

// Using theme values directly
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.spacing.radius.md,
  },
  title: {
    ...theme.common.text.h1,
    color: theme.colors.text.primary,
  },
});
```

### Using Common Styles
```javascript
// Predefined common styles
const styles = StyleSheet.create({
  card: {
    ...theme.common.card,
  },
  button: {
    ...theme.common.button.primary,
  },
  text: {
    ...theme.common.text.body,
  },
});
```

### Color Usage
```javascript
// Semantic color usage
const styles = StyleSheet.create({
  successButton: {
    backgroundColor: theme.colors.success[500],
  },
  errorText: {
    color: theme.colors.error[500],
  },
  primaryBackground: {
    backgroundColor: theme.colors.primary[100],
  },
});
```

## 📁 File Structure
```
theme/
├── colors.js          # Color palette and semantic colors
├── spacing.js         # Spacing, gaps, and border radius
├── typography.js      # Font sizes, weights, and text styles
├── shadows.js         # Shadow and elevation system
├── index.js           # Main theme export and common styles
└── README.md          # This documentation
```

## 🎯 Best Practices

### 1. Use Semantic Names
```javascript
// ✅ Good - Semantic naming
backgroundColor: theme.colors.background.primary
color: theme.colors.text.primary

// ❌ Bad - Hard-coded values
backgroundColor: '#f8f9fa'
color: '#2c3e50'
```

### 2. Use Theme Spacing
```javascript
// ✅ Good - Consistent spacing
padding: theme.spacing.lg
marginBottom: theme.spacing.md

// ❌ Bad - Arbitrary values
padding: 16
marginBottom: 12
```

### 3. Use Predefined Text Styles
```javascript
// ✅ Good - Consistent typography
...theme.common.text.h1
...theme.common.text.body

// ❌ Bad - Inline styles
fontSize: 24, fontWeight: 'bold'
fontSize: 16, fontWeight: 'normal'
```

### 4. Use Theme Shadows
```javascript
// ✅ Good - Consistent elevation
...theme.shadows.card
...theme.shadows.button

// ❌ Bad - Inline shadows
shadowColor: '#000', shadowOffset: { width: 0, height: 4 }
```

## 🔧 Customization

### Adding New Colors
```javascript
// In colors.js
export const colors = {
  // ... existing colors
  custom: {
    brand: '#FF6B6B',
    accent: '#4ECDC4',
  },
};
```

### Adding New Spacing Values
```javascript
// In spacing.js
export const spacing = {
  // ... existing spacing
  custom: 36,
  hero: 80,
};
```

### Adding New Text Styles
```javascript
// In typography.js
export const typography = {
  styles: {
    // ... existing styles
    hero: {
      fontSize: 48,
      fontWeight: 'bold',
      lineHeight: 1.1,
    },
  },
};
```

## 🌟 Benefits

1. **Consistency**: All components use the same design tokens
2. **Maintainability**: Changes to design system are centralized
3. **Scalability**: Easy to add new components and features
4. **Developer Experience**: Clear naming and organization
5. **Design Handoff**: Clear documentation for designers
6. **Accessibility**: Consistent contrast ratios and sizing
7. **Performance**: Optimized for React Native

## 📱 React Native Specific

This theme system is specifically designed for React Native:
- Uses React Native's StyleSheet API
- Includes platform-specific shadow properties
- Optimized for mobile performance
- Supports both iOS and Android platforms

## 🔄 Migration Guide

When migrating from hard-coded styles:

1. Replace color values with theme colors
2. Replace spacing values with theme spacing
3. Replace typography with theme text styles
4. Replace shadows with theme shadow styles
5. Use common styles where applicable

Example migration:
```javascript
// Before
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

// After
const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
    padding: theme.spacing.lg,
    borderRadius: theme.spacing.radius.md,
  },
  title: {
    ...theme.common.text.h1,
  },
});
``` 