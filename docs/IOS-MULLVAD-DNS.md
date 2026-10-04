# iPhone: Sorta Omega with Mullvad Base DNS

The stock Mullvad Base encrypted-DNS profile intercepted the private Tailscale name `silent-4090.tail19ab4a.ts.net`. On the owner's iPhone, Tailscale could ping the server, but Safari reported that the hostname could not be found. Selecting Automatic DNS immediately made the Sorta sign-in page load.

`apps/web/public/downloads/sorta-mullvad-base-tailscale.mobileconfig` is a manually installable, unsigned alternative DNS profile. It contains exactly one DNS-settings payload: Mullvad Base DNS-over-HTTPS (`https://base.dns.mullvad.net/dns-query`) for normal domains, with an Apple `OnDemandRules` `NeverConnect` exception for `tail19ab4a.ts.net`. That exception is intended to leave this tailnet's DNS lookup to Tailscale. It adds no VPN, root certificate, MDM enrollment, or device restrictions and can be removed. The app serves it as a file download with the iOS configuration-profile MIME type at `/setup/ios-dns.mobileconfig`.

This profile is **prepared, not yet verified on the owner's iPhone**. To test it safely:

1. Keep Tailscale connected and its **Use Tailscale DNS Settings** preference enabled. Do not delete the existing signed Mullvad profile.
2. Open `https://silent-4090.tail19ab4a.ts.net/setup/ios-dns.mobileconfig` in iPhone Safari while Automatic DNS is selected. If Safari puts the file in Downloads rather than showing **Profile Downloaded**, open the `.mobileconfig` file from the Files app. Inspect the installation screen: it should show only a DNS setting, with no certificate, VPN, or device management. Stop if it shows anything else.
3. In **Settings → General → VPN & Device Management**, install the downloaded profile, then select **Sorta Omega + Mullvad Base DNS** under DNS. Keep the old Mullvad profile installed but not selected.
4. In Safari, verify `https://silent-4090.tail19ab4a.ts.net/` loads without a certificate warning and the existing sign-in works. Also visit an ordinary public site and check that DNS protection still behaves as expected. Test both Wi-Fi and cellular.
5. If either test fails, select **Automatic** DNS again, then remove only this new profile. The original Mullvad profile remains available.

The profile is unsigned because modifying Mullvad's signed profile would invalidate its signature. Its contents are plain XML so they can be inspected before installation. DNS for the excluded tailnet domain is deliberately handled by Tailscale, not Mullvad; all other DNS is intended to use Mullvad Base. Installing a configuration profile changes device-wide DNS behavior and requires the owner's confirmation on the iPhone.

Mullvad [announced](https://mullvad.net/en/blog/2026/9/3/shutting-down-our-public-encrypted-dns-servers-and-sponsoring-quad9-instead) that its public encrypted-DNS service, including this Base endpoint, will shut down on **2 November 2026**. This is a short-term compatibility test, not a permanent DNS solution. Replace it before that date; do not silently fall back to unencrypted DNS.

The exception uses Apple's documented [DNS Settings profile `OnDemandRules`](https://github.com/apple/device-management/blob/release/mdm/profiles/com.apple.dnsSettings.managed.yaml), where `EvaluateConnection` permits per-domain exceptions and `NeverConnect` excludes the named domain from this DNS setting.
