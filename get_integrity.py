import json
import urllib.request

def get_package_info(package_name, version):
    url = f"https://registry.npmjs.org/{package_name}/{version}"
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read())
        return {
            "version": data["version"],
            "resolved": data["dist"]["tarball"],
            "integrity": data["dist"]["integrity"],
            "license": data.get("license", "MIT")
        }

iap = get_package_info("react-native-iap", "14.4.46")
nitro = get_package_info("react-native-nitro-modules", "0.31.10")

print(json.dumps({"iap": iap, "nitro": nitro}, indent=2))
