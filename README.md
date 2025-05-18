# resend-local

A local emulator for the [Resend](https://resend.com) email API.

Inspired by [`aws-ses-v2-local`](https://github.com/domdomegg/aws-ses-v2-local), this tool provides a local server that receives email send requests and displays the email content (HTML, subject, from/to, etc.) via a browser-based UI — without sending real emails.

## Usage

You can start the server with:

```bash
npx resend-local
```

Or, if you're using pnpm:

```bash
pnpm dlx resend-local
```

You can specify the port with the `-p` or `--port` option (default is `8005`):

```bash
npx resend-local -p 8080
```

To use the local server, set the `RESEND_BASE_URL` environment variable in your application:

```bash
RESEND_BASE_URL=http://localhost:8005 your-app
```

For example, if you're using Node.js:

```bash
RESEND_BASE_URL=http://localhost:8005 node your-app.js
```

In a Next.js project, you can add it to `.env.local`:

```bash
RESEND_BASE_URL=http://localhost:8005
```

## Features

- Accepts email send requests compatible with the Resend API
- Displays email content (HTML body, subject, from/to) in a web UI
- Allows previewing emails without sending them
- Supports custom port configuration via `--port` option
- Useful for local development and testing

## License

This project is licensed under the [MIT License](LICENSE).
