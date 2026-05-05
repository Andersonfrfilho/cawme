const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

const replacements = [
  {
    relativePath:
      'node_modules/expo-modules-core/ios/Core/Views/SwiftUI/SwiftUIHostingView.swift',
    from:
      '  public final class HostingView<Props: ViewProps, ContentView: View<Props>>: ExpoView, @MainActor AnyExpoSwiftUIHostingView {',
    to:
      '  @MainActor\n  public final class HostingView<Props: ViewProps, ContentView: View<Props>>: ExpoView, AnyExpoSwiftUIHostingView {',
  },
  {
    relativePath:
      'node_modules/expo-modules-core/ios/Core/Views/SwiftUI/SwiftUIVirtualView.swift',
    from: 'extension ExpoSwiftUI.SwiftUIVirtualView: @MainActor ExpoSwiftUI.ViewWrapper {',
    to: '@MainActor\nextension ExpoSwiftUI.SwiftUIVirtualView: ExpoSwiftUI.ViewWrapper {',
  },
  {
    relativePath: 'node_modules/expo-modules-core/ios/Core/Views/ViewDefinition.swift',
    from: 'extension UIView: @MainActor AnyArgument {',
    to: '@MainActor\nextension UIView: AnyArgument {',
  },
  {
    relativePath:
      'node_modules/expo-notifications/ios/ExpoNotifications/Notifications/DateComponentsSerializer.swift',
    from:
      '    if #available(iOS 26.0, *) {\n      serializedComponents["isRepeatedDay"] = dateComponents.isRepeatedDay ?? false\n    }',
    to:
      '    #if compiler(>=6.2)\n    if #available(iOS 26.0, *) {\n      serializedComponents["isRepeatedDay"] = dateComponents.isRepeatedDay ?? false\n    }\n    #endif',
  },
  {
    relativePath: 'node_modules/expo-image-picker/ios/MediaHandler.swift',
    from:
      '  private func getMimeType(from asset: PHAsset?, fileExtension: String) -> String? {\n    let utType: UTType? = if #available(iOS 26.0, *) {\n      asset?.contentType ?? UTType(filenameExtension: fileExtension)\n    } else {\n      UTType(filenameExtension: fileExtension)\n    }\n    return utType?.preferredMIMEType\n  }',
    to:
      '  private func getMimeType(from asset: PHAsset?, fileExtension: String) -> String? {\n    let utType: UTType?\n    #if compiler(>=6.2)\n    if #available(iOS 26.0, *) {\n      utType = asset?.contentType ?? UTType(filenameExtension: fileExtension)\n    } else {\n      utType = UTType(filenameExtension: fileExtension)\n    }\n    #else\n    utType = UTType(filenameExtension: fileExtension)\n    #endif\n    return utType?.preferredMIMEType\n  }',
  },
  {
    relativePath: 'node_modules/expo-image-picker/ios/MediaHandler.swift',
    from:
      '  private func getMimeType(from resource: PHAssetResource, fileExtension: String) -> String? {\n    let utType: UTType? = if #available(iOS 26.0, *) {\n      resource.contentType\n    } else {\n      UTType(resource.uniformTypeIdentifier) ?? UTType(filenameExtension: fileExtension)\n    }\n    return utType?.preferredMIMEType\n  }',
    to:
      '  private func getMimeType(from resource: PHAssetResource, fileExtension: String) -> String? {\n    let utType: UTType?\n    #if compiler(>=6.2)\n    if #available(iOS 26.0, *) {\n      utType = resource.contentType\n    } else {\n      utType = UTType(resource.uniformTypeIdentifier) ?? UTType(filenameExtension: fileExtension)\n    }\n    #else\n    utType = UTType(resource.uniformTypeIdentifier) ?? UTType(filenameExtension: fileExtension)\n    #endif\n    return utType?.preferredMIMEType\n  }',
  },
  {
    relativePath: 'node_modules/expo-image/ios/ImageView.swift',
    from:
      '  @available(iOS 26.0, tvOS 26.0, *)\n  private func applySymbolEffectiOS26(effect: SFSymbolEffectType, scope: SFSymbolEffectScope?, options: SymbolEffectOptions) {\n    switch effect {\n    case .drawOn:\n      switch scope {\n      case .byLayer: sdImageView.addSymbolEffect(.drawOn.byLayer, options: options)\n      case .wholeSymbol: sdImageView.addSymbolEffect(.drawOn.wholeSymbol, options: options)\n      case .none: sdImageView.addSymbolEffect(.drawOn, options: options)\n      }\n    case .drawOff:\n      switch scope {\n      case .byLayer: sdImageView.addSymbolEffect(.drawOff.byLayer, options: options)\n      case .wholeSymbol: sdImageView.addSymbolEffect(.drawOff.wholeSymbol, options: options)\n      case .none: sdImageView.addSymbolEffect(.drawOff, options: options)\n      }\n    default:\n      break\n    }\n  }',
    to:
      '  @available(iOS 26.0, tvOS 26.0, *)\n  private func applySymbolEffectiOS26(effect: SFSymbolEffectType, scope: SFSymbolEffectScope?, options: SymbolEffectOptions) {\n    #if compiler(>=6.2)\n    switch effect {\n    case .drawOn:\n      switch scope {\n      case .byLayer: sdImageView.addSymbolEffect(.drawOn.byLayer, options: options)\n      case .wholeSymbol: sdImageView.addSymbolEffect(.drawOn.wholeSymbol, options: options)\n      case .none: sdImageView.addSymbolEffect(.drawOn, options: options)\n      }\n    case .drawOff:\n      switch scope {\n      case .byLayer: sdImageView.addSymbolEffect(.drawOff.byLayer, options: options)\n      case .wholeSymbol: sdImageView.addSymbolEffect(.drawOff.wholeSymbol, options: options)\n      case .none: sdImageView.addSymbolEffect(.drawOff, options: options)\n      }\n    default:\n      break\n    }\n    #else\n    _ = effect\n    _ = scope\n    _ = options\n    #endif\n  }',
  },
  {
    relativePath: 'node_modules/expo-router/ios/Toolbar/RouterToolbarHostView.swift',
    from:
      '            if #available(iOS 26.0, *) {\n              if let hidesSharedBackground = menu.hidesSharedBackground {\n                item.hidesSharedBackground = hidesSharedBackground\n              }\n              if let sharesBackground = menu.sharesBackground {\n                item.sharesBackground = sharesBackground\n              }\n            }',
    to:
      '            #if compiler(>=6.2)\n            if #available(iOS 26.0, *) {\n              if let hidesSharedBackground = menu.hidesSharedBackground {\n                item.hidesSharedBackground = hidesSharedBackground\n              }\n              if let sharesBackground = menu.sharesBackground {\n                item.sharesBackground = sharesBackground\n              }\n            }\n            #endif',
  },
  {
    relativePath: 'node_modules/expo-router/ios/Toolbar/RouterToolbarItemView.swift',
    from:
      '    } else if type == .searchBar {\n      guard #available(iOS 26.0, *), let controller = self.host?.findViewController() else {\n        // Check for iOS 26, should already be guarded by the JS side, so this warning will only fire if controller is nil\n        logger?.warn(\n          "[expo-router] navigationItem.searchBarPlacementBarButtonItem not available. This is most likely a bug in expo-router."\n        )\n        currentBarButtonItem = nil\n        return\n      }\n      guard let navController = controller.navigationController else {\n        currentBarButtonItem = nil\n        return\n      }\n      guard navController.isNavigationBarHidden == false else {\n        logger?.warn(\n          "[expo-router] Toolbar.SearchBarPreferredSlot should only be used when stack header is shown."\n        )\n        currentBarButtonItem = nil\n        return\n      }\n\n      item = controller.navigationItem.searchBarPlacementBarButtonItem\n    } else {',
    to:
      '    } else if type == .searchBar {\n      #if compiler(>=6.2)\n      guard #available(iOS 26.0, *), let controller = self.host?.findViewController() else {\n        // Check for iOS 26, should already be guarded by the JS side, so this warning will only fire if controller is nil\n        logger?.warn(\n          "[expo-router] navigationItem.searchBarPlacementBarButtonItem not available. This is most likely a bug in expo-router."\n        )\n        currentBarButtonItem = nil\n        return\n      }\n      guard let navController = controller.navigationController else {\n        currentBarButtonItem = nil\n        return\n      }\n      guard navController.isNavigationBarHidden == false else {\n        logger?.warn(\n          "[expo-router] Toolbar.SearchBarPreferredSlot should only be used when stack header is shown."\n        )\n        currentBarButtonItem = nil\n        return\n      }\n\n      item = controller.navigationItem.searchBarPlacementBarButtonItem\n      #else\n      logger?.warn(\n        "[expo-router] Toolbar searchBar requires a newer iOS SDK/Xcode toolchain."\n      )\n      currentBarButtonItem = nil\n      return\n      #endif\n    } else {',
  },
  {
    relativePath: 'node_modules/expo-router/ios/Toolbar/RouterToolbarItemView.swift',
    from:
      '    if #available(iOS 26.0, *) {\n      item.hidesSharedBackground = hidesSharedBackground\n      item.sharesBackground = sharesBackground\n    }',
    to:
      '    #if compiler(>=6.2)\n    if #available(iOS 26.0, *) {\n      item.hidesSharedBackground = hidesSharedBackground\n      item.sharesBackground = sharesBackground\n    }\n    #endif',
  },
  {
    relativePath: 'node_modules/expo-router/ios/Toolbar/RouterToolbarItemView.swift',
    from:
      '    if #available(iOS 26.0, *) {\n      if let badgeConfig = badgeConfiguration {\n        var badge = UIBarButtonItem.Badge.indicator()\n        if let value = badgeConfig.value {\n          badge = .string(value)\n        }\n        if let backgroundColor = badgeConfig.backgroundColor {\n          badge.backgroundColor = backgroundColor\n        }\n        if let foregroundColor = badgeConfig.color {\n          badge.foregroundColor = foregroundColor\n        }\n        if badgeConfig.fontFamily != nil || badgeConfig.fontSize != nil\n          || badgeConfig.fontWeight != nil {\n          let font = RouterFontUtils.convertTitleStyleToFont(\n            TitleStyle(\n              fontFamily: badgeConfig.fontFamily,\n              fontSize: badgeConfig.fontSize,\n              fontWeight: badgeConfig.fontWeight\n            ))\n          badge.font = font\n        }\n        item.badge = badge\n      } else {\n        item.badge = nil\n      }\n    }',
    to:
      '    #if compiler(>=6.2)\n    if #available(iOS 26.0, *) {\n      if let badgeConfig = badgeConfiguration {\n        var badge = UIBarButtonItem.Badge.indicator()\n        if let value = badgeConfig.value {\n          badge = .string(value)\n        }\n        if let backgroundColor = badgeConfig.backgroundColor {\n          badge.backgroundColor = backgroundColor\n        }\n        if let foregroundColor = badgeConfig.color {\n          badge.foregroundColor = foregroundColor\n        }\n        if badgeConfig.fontFamily != nil || badgeConfig.fontSize != nil\n          || badgeConfig.fontWeight != nil {\n          let font = RouterFontUtils.convertTitleStyleToFont(\n            TitleStyle(\n              fontFamily: badgeConfig.fontFamily,\n              fontSize: badgeConfig.fontSize,\n              fontWeight: badgeConfig.fontWeight\n            ))\n          badge.font = font\n        }\n        item.badge = badge\n      } else {\n        item.badge = nil\n      }\n    }\n    #endif',
  },
  {
    relativePath: 'node_modules/expo-router/ios/Toolbar/RouterToolbarModule.swift',
    from:
      '    case .prominent:\n      if #available(iOS 26.0, *) {\n        return .prominent\n      } else {\n        return .done\n      }',
    to:
      '    case .prominent:\n      #if compiler(>=6.2)\n      if #available(iOS 26.0, *) {\n        return .prominent\n      } else {\n        return .done\n      }\n      #else\n      return .done\n      #endif',
  },
];

let changedFiles = 0;

for (const replacement of replacements) {
  const filePath = path.join(projectRoot, replacement.relativePath);

  if (!fs.existsSync(filePath)) {
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes(replacement.from)) {
    continue;
  }

  const nextContent = content.replace(replacement.from, replacement.to);

  if (nextContent !== content) {
    fs.writeFileSync(filePath, nextContent, 'utf8');
    changedFiles += 1;
  }
}

if (changedFiles > 0) {
  console.log(`[patch-expo-modules-core-swift] Patched ${changedFiles} file(s).`);
} else {
  console.log('[patch-expo-modules-core-swift] No changes needed.');
}
