import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, Shield, AlertTriangle, Users, Gavel } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full">
              <Scale className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground">Please read these terms carefully before using our services.</p>
          <p className="text-sm text-muted-foreground mt-2">Last updated: December 2024</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                By accessing and using LinkToQR.me ("the Service"), you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Important:</strong> These terms constitute a legally binding agreement between you and
                  LinkToQR.me. Please read them carefully.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2 text-green-600" />
                Service Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                LinkToQR.me provides a comprehensive suite of digital tools including but not limited to:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Image Processing Tools:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Image compression and optimization</li>
                    <li>• Image enhancement and filtering</li>
                    <li>• Image resizing and cropping</li>
                    <li>• Format conversion</li>
                    <li>• Background merging</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Document & QR Tools:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• QR code generation and scanning</li>
                    <li>• PDF creation and merging</li>
                    <li>• Document scanning</li>
                    <li>• Digital signatures</li>
                    <li>• Text extraction (OCR)</li>
                  </ul>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Privacy First:</strong> All processing happens locally in your browser. We do not store or
                  access your files.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-2 text-purple-600" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Acceptable Use:</h4>
                <ul className="text-muted-foreground space-y-2 ml-4">
                  <li>• Use the service for lawful purposes only</li>
                  <li>• Respect intellectual property rights</li>
                  <li>• Do not attempt to reverse engineer or hack the service</li>
                  <li>• Do not use the service to process illegal content</li>
                  <li>• Do not overload our servers with excessive requests</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Content Responsibility:</h4>
                <p className="text-muted-foreground">
                  You are solely responsible for any content you process through our tools. Ensure you have the right to
                  use, modify, and distribute any files you upload or process.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-orange-600" />
                Limitations and Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Service Availability:</h4>
                <p className="text-muted-foreground">
                  While we strive for 100% uptime, we cannot guarantee uninterrupted service. The service is provided
                  "as is" without warranties of any kind.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">File Processing:</h4>
                <ul className="text-muted-foreground space-y-1 ml-4">
                  <li>• Processing quality may vary based on input file quality</li>
                  <li>• Large files may take longer to process</li>
                  <li>• Some file formats may not be supported</li>
                  <li>• Browser compatibility may affect functionality</li>
                </ul>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  <strong>Important:</strong> Always keep backups of important files. While our tools are designed to be
                  safe, we recommend backing up original files before processing.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gavel className="h-6 w-6 mr-2 text-red-600" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, LinkToQR.me shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, including without limitation, loss of profits, data, use,
                goodwill, or other intangible losses.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Specific Limitations:</h4>
                <ul className="text-muted-foreground space-y-1 ml-4">
                  <li>• Data loss or corruption during processing</li>
                  <li>• Service interruptions or downtime</li>
                  <li>• Compatibility issues with specific browsers or devices</li>
                  <li>• Third-party service failures (ads, analytics)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Our Rights:</h4>
                <p className="text-muted-foreground">
                  The LinkToQR.me service, including its design, functionality, and code, is protected by copyright and
                  other intellectual property laws. You may not copy, modify, or distribute our service without
                  permission.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Your Rights:</h4>
                <p className="text-muted-foreground">
                  You retain all rights to the content you process through our tools. We do not claim ownership of your
                  files or data.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modifications to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon
                posting to this page. Your continued use of the service after changes constitutes acceptance of the new
                terms.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Stay Updated:</strong> We recommend checking this page periodically for updates to our terms.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> legal@linktoqr.me
                </p>
                <p>
                  <strong>Support:</strong> support@linktoqr.me
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
              These terms are effective as of December 2024. By using LinkToQR.me, you acknowledge that you have read,
              understood, and agree to be bound by these terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
