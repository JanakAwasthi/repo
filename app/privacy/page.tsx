import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground">Your privacy is our priority. Learn how we protect your data.</p>
          <p className="text-sm text-muted-foreground mt-2">Last updated: December 2024</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-6 w-6 mr-2 text-green-600" />
                Data Processing Philosophy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                LinkToQR.me is built with privacy-first principles. All file processing happens locally in your browser,
                ensuring your sensitive data never leaves your device.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ What We DO:</h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Process all files locally in your browser</li>
                  <li>• Use secure, client-side encryption for stored notes</li>
                  <li>• Provide tools that work completely offline</li>
                  <li>• Respect your privacy and data ownership</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ What We DON'T DO:</h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• Upload your files to our servers</li>
                  <li>• Store your personal documents or images</li>
                  <li>• Track your file processing activities</li>
                  <li>• Share your data with third parties</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-6 w-6 mr-2 text-blue-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Automatically Collected Information:</h4>
                <ul className="text-muted-foreground space-y-2 ml-4">
                  <li>
                    • <strong>Usage Analytics:</strong> Basic website usage statistics (page views, tool usage
                    frequency)
                  </li>
                  <li>
                    • <strong>Technical Data:</strong> Browser type, device information, IP address (anonymized)
                  </li>
                  <li>
                    • <strong>Performance Data:</strong> Loading times and error reports to improve service quality
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Information You Provide:</h4>
                <ul className="text-muted-foreground space-y-2 ml-4">
                  <li>
                    • <strong>Stored Notes:</strong> Text content you choose to save using our note storage tools
                  </li>
                  <li>
                    • <strong>Contact Information:</strong> Email address if you contact our support
                  </li>
                  <li>
                    • <strong>Feedback:</strong> Any feedback or suggestions you provide
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-6 w-6 mr-2 text-purple-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Service Improvement:</h4>
                  <p className="text-muted-foreground">
                    We use anonymized usage data to understand which tools are most popular and identify areas for
                    improvement.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Technical Support:</h4>
                  <p className="text-muted-foreground">
                    Error reports help us fix bugs and improve the reliability of our tools.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Communication:</h4>
                  <p className="text-muted-foreground">
                    We may use your contact information to respond to support requests or important service updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="h-6 w-6 mr-2 text-orange-600" />
                Your Rights and Choices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Data Control:</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Access and download any data we have about you</li>
                    <li>• Request correction of inaccurate information</li>
                    <li>• Request deletion of your personal data</li>
                    <li>• Opt-out of non-essential data collection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Browser Controls:</h4>
                  <ul className="text-muted-foreground space-y-1 ml-4">
                    <li>• Clear your browser's local storage to remove stored notes</li>
                    <li>• Disable cookies through your browser settings</li>
                    <li>• Use private/incognito browsing mode</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2 text-indigo-600" />
                Third-Party Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Google AdSense:</h4>
                  <p className="text-muted-foreground">
                    We use Google AdSense to display relevant advertisements. Google may use cookies to serve ads based
                    on your interests. You can opt-out of personalized advertising by visiting Google's Ad Settings.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Analytics:</h4>
                  <p className="text-muted-foreground">
                    We use privacy-focused analytics to understand website usage patterns. All data is anonymized and
                    aggregated.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> privacy@linktoqr.me
                </p>
                <p>
                  <strong>WhatsApp:</strong> Available through our contact form
                </p>
                <p>
                  <strong>Response Time:</strong> We aim to respond within 48 hours
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              This privacy policy is effective as of December 2024 and may be updated periodically. We will notify users
              of any significant changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
