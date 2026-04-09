#!/bin/bash
set -e

echo "🚀 Setting up Finance Manager..."

TEMP_DIR="/tmp/FinanceManagerBase"

echo "📦 Initializing React Native base project..."
rm -rf "$TEMP_DIR"
npx react-native@0.73.6 init FinanceManagerBase --directory "$TEMP_DIR" --skip-install

echo "📁 Copying native directories..."
cp -r "$TEMP_DIR/android" ./android
cp -r "$TEMP_DIR/ios" ./ios
cp "$TEMP_DIR/Gemfile" ./Gemfile 2>/dev/null || true

echo "🧹 Cleaning up temp..."
rm -rf "$TEMP_DIR"

echo "📦 Installing npm dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "  iOS:     cd ios && pod install && cd .. && npx react-native run-ios"
echo "  Android: npx react-native run-android"
echo ""
