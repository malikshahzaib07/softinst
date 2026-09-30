export type CategoryId =
  | 'web'
  | 'messaging'
  | 'media'
  | 'imaging'
  | 'documents'
  | 'security'
  | 'cloud'
  | 'utilities'
  | 'developer'
  | 'runtimes'
  | 'gaming'

export interface AppSoftware {
  id: string
  name: string
  vendor: string
  category: CategoryId
  description: string
  wingetId: string
  website: string
  color: string
  icon: string
  minRamGB: number
  recommendedRamGB: number
  minCores: number
  minDiskMB: number
  notes?: string
  popular?: boolean
}

export interface Category {
  id: CategoryId
  name: string
  blurb: string
  color: string
  icon: string
}

export const CATEGORIES: Category[] = [
  { id: 'web', name: 'Web Browsers', blurb: 'Surf with the latest browsers', color: '#4CC9F0', icon: 'Globe' },
  { id: 'messaging', name: 'Messaging', blurb: 'Chat, calls, and meetings', color: '#7B61FF', icon: 'MessageCircle' },
  { id: 'media', name: 'Media', blurb: 'Play, record, and stream', color: '#FF8DC7', icon: 'Clapperboard' },
  { id: 'imaging', name: 'Imaging', blurb: 'Photos, drawing, capture', color: '#FF5A5F', icon: 'Image' },
  { id: 'documents', name: 'Documents', blurb: 'Office, notes, and PDFs', color: '#7DDE92', icon: 'FileText' },
  { id: 'security', name: 'Security', blurb: 'Passwords and protection', color: '#FF5A5F', icon: 'Shield' },
  { id: 'cloud', name: 'Cloud & Sharing', blurb: 'Sync, torrents, remote files', color: '#00C2B8', icon: 'Cloud' },
  { id: 'utilities', name: 'Utilities', blurb: 'Zip, clean, measure, tweak', color: '#FFD166', icon: 'Wrench' },
  { id: 'developer', name: 'Developer', blurb: 'Editors, git, runtimes, APIs', color: '#7B61FF', icon: 'Code' },
  { id: 'runtimes', name: 'Runtimes', blurb: 'Java, .NET, C++ redistributables', color: '#8B8FA8', icon: 'Cpu' },
  { id: 'gaming', name: 'Gaming', blurb: 'Launchers for your library', color: '#7DDE92', icon: 'Gamepad2' },
]

export const APPS: AppSoftware[] = [
  // Web
  { id: 'chrome', name: 'Google Chrome', vendor: 'Google', category: 'web', description: 'Fast, widely compatible Chromium browser with a huge extension library.', wingetId: 'Google.Chrome', website: 'https://www.google.com/chrome/', color: '#4285F4', icon: 'Globe', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 500, popular: true },
  { id: 'firefox', name: 'Mozilla Firefox', vendor: 'Mozilla', category: 'web', description: 'Independent, privacy-first browser with a strong extension ecosystem.', wingetId: 'Mozilla.Firefox', website: 'https://www.mozilla.org/firefox/', color: '#FF7139', icon: 'Flame', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 300, popular: true },
  { id: 'edge', name: 'Microsoft Edge', vendor: 'Microsoft', category: 'web', description: 'Chromium-based browser built into Windows with Microsoft account sync.', wingetId: 'Microsoft.Edge', website: 'https://www.microsoft.com/edge', color: '#0078D4', icon: 'Globe', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 400 },
  { id: 'brave', name: 'Brave', vendor: 'Brave Software', category: 'web', description: 'Chromium browser with built-in tracker and ad blocking.', wingetId: 'Brave.Brave', website: 'https://brave.com/', color: '#FB542B', icon: 'Shield', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 400, popular: true },
  { id: 'opera', name: 'Opera', vendor: 'Opera', category: 'web', description: 'Feature-packed browser with a free VPN, workspaces, and built-in messengers.', wingetId: 'Opera.Opera', website: 'https://www.opera.com/', color: '#FF1B2D', icon: 'Globe', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 400 },
  { id: 'vivaldi', name: 'Vivaldi', vendor: 'Vivaldi', category: 'web', description: 'Highly customizable Chromium browser for power users.', wingetId: 'Vivaldi.Vivaldi', website: 'https://vivaldi.com/', color: '#EF3939', icon: 'Compass', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 400 },
  { id: 'librewolf', name: 'LibreWolf', vendor: 'LibreWolf', category: 'web', description: 'Privacy-hardened Firefox fork with telemetry stripped out.', wingetId: 'LibreWolf.LibreWolf', website: 'https://librewolf.net/', color: '#00A6D6', icon: 'Shield', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 300 },

  // Messaging
  { id: 'discord', name: 'Discord', vendor: 'Discord', category: 'messaging', description: 'Voice, video, and text chat for communities and friends.', wingetId: 'Discord.Discord', website: 'https://discord.com/', color: '#5865F2', icon: 'MessageCircle', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 400, popular: true },
  { id: 'slack', name: 'Slack', vendor: 'Salesforce', category: 'messaging', description: 'Workplace messaging with channels, huddles, and app integrations.', wingetId: 'SlackTechnologies.Slack', website: 'https://slack.com/', color: '#E01E5A', icon: 'Hash', minRamGB: 4, recommendedRamGB: 8, minCores: 2, minDiskMB: 500 },
  { id: 'zoom', name: 'Zoom', vendor: 'Zoom', category: 'messaging', description: 'Video meetings, webinars, and screen sharing for work and school.', wingetId: 'Zoom.Zoom', website: 'https://zoom.us/', color: '#2D8CFF', icon: 'Video', minRamGB: 4, recommendedRamGB: 8, minCores: 2, minDiskMB: 400, popular: true },
  { id: 'teams', name: 'Microsoft Teams', vendor: 'Microsoft', category: 'messaging', description: 'Chat, meetings, and files inside the Microsoft 365 world.', wingetId: 'Microsoft.Teams', website: 'https://www.microsoft.com/microsoft-teams/', color: '#5059C9', icon: 'Users', minRamGB: 4, recommendedRamGB: 8, minCores: 2, minDiskMB: 500 },
  { id: 'skype', name: 'Skype', vendor: 'Microsoft', category: 'messaging', description: 'Classic free video calls and instant messaging.', wingetId: 'Microsoft.Skype', website: 'https://www.skype.com/', color: '#00AFF0', icon: 'Phone', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 200 },
  { id: 'telegram', name: 'Telegram', vendor: 'Telegram', category: 'messaging', description: 'Fast cloud messenger with huge group chats and file sharing.', wingetId: 'Telegram.TelegramDesktop', website: 'https://desktop.telegram.org/', color: '#26A5E4', icon: 'Send', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 150, popular: true },
  { id: 'whatsapp', name: 'WhatsApp', vendor: 'Meta', category: 'messaging', description: 'Official desktop app for WhatsApp messaging and calls.', wingetId: 'WhatsApp.WhatsApp', website: 'https://www.whatsapp.com/download', color: '#25D366', icon: 'MessageCircle', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 300 },
  { id: 'signal', name: 'Signal', vendor: 'Signal Foundation', category: 'messaging', description: 'End-to-end encrypted messenger with no ads and no tracking.', wingetId: 'OpenWhisperSystems.Signal', website: 'https://signal.org/', color: '#3A76F0', icon: 'Lock', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 250 },
  { id: 'thunderbird', name: 'Thunderbird', vendor: 'Mozilla', category: 'messaging', description: 'Open-source desktop email, calendar, and chat client.', wingetId: 'Mozilla.Thunderbird', website: 'https://www.thunderbird.net/', color: '#0A84FF', icon: 'Mail', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 250 },

  // Media
  { id: 'vlc', name: 'VLC media player', vendor: 'VideoLAN', category: 'media', description: 'Plays almost every audio and video format without extra codecs.', wingetId: 'VideoLAN.VLC', website: 'https://www.videolan.org/vlc/', color: '#FF8800', icon: 'Play', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 150, popular: true },
  { id: 'spotify', name: 'Spotify', vendor: 'Spotify', category: 'media', description: 'Stream music, podcasts, and playlists from the official desktop app.', wingetId: 'Spotify.Spotify', website: 'https://www.spotify.com/', color: '#1DB954', icon: 'Music', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 300, popular: true },
  { id: 'itunes', name: 'iTunes', vendor: 'Apple', category: 'media', description: 'Apple music library, device sync, and podcasts for Windows.', wingetId: 'Apple.iTunes', website: 'https://www.apple.com/itunes/', color: '#FB5C74', icon: 'Music', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 400 },
  { id: 'audacity', name: 'Audacity', vendor: 'Muse Group', category: 'media', description: 'Free, open-source audio recorder and editor.', wingetId: 'Audacity.Audacity', website: 'https://www.audacityteam.org/', color: '#0000CC', icon: 'AudioLines', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 200 },
  { id: 'obs', name: 'OBS Studio', vendor: 'OBS Project', category: 'media', description: 'Free software for live streaming and high-quality screen recording.', wingetId: 'OBSProject.OBSStudio', website: 'https://obsproject.com/', color: '#302E31', icon: 'Video', minRamGB: 4, recommendedRamGB: 8, minCores: 4, minDiskMB: 600, notes: 'A dedicated GPU is recommended for 1080p60 encoding.', popular: true },
  { id: 'handbrake', name: 'HandBrake', vendor: 'HandBrake', category: 'media', description: 'Open-source video transcoder for converting and compressing files.', wingetId: 'HandBrake.HandBrake', website: 'https://handbrake.fr/', color: '#9A2D2D', icon: 'Clapperboard', minRamGB: 4, recommendedRamGB: 8, minCores: 4, minDiskMB: 200 },
  { id: 'kodi', name: 'Kodi', vendor: 'XBMC Foundation', category: 'media', description: 'Open-source media center for local libraries and add-ons.', wingetId: 'XBMCFoundation.Kodi', website: 'https://kodi.tv/', color: '#17B2E7', icon: 'Tv', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 250 },
  { id: 'foobar', name: 'foobar2000', vendor: 'Peter Pawlowski', category: 'media', description: 'Lightweight, highly customizable audio player for audiophiles.', wingetId: 'PeterPawlowski.foobar2000', website: 'https://www.foobar2000.org/', color: '#1E4B8F', icon: 'Music', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 50 },
  { id: 'klite', name: 'K-Lite Codec Pack', vendor: 'Codec Guide', category: 'media', description: 'Full codec pack plus Media Player Classic for stubborn video files.', wingetId: 'CodecGuide.K-LiteCodecPack.Full', website: 'https://codecguide.com/', color: '#F5A623', icon: 'Film', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 150 },

  // Imaging
  { id: 'gimp', name: 'GIMP', vendor: 'GIMP Team', category: 'imaging', description: 'Free Photoshop-class image editor for photo retouching and design.', wingetId: 'GIMP.GIMP', website: 'https://www.gimp.org/', color: '#5C5548', icon: 'Image', minRamGB: 4, recommendedRamGB: 8, minCores: 2, minDiskMB: 500, popular: true },
  { id: 'paintnet', name: 'Paint.NET', vendor: 'dotPDN', category: 'imaging', description: 'Friendly yet powerful image editor that feels like Paint grown up.', wingetId: 'dotPDN.PaintDotNet', website: 'https://www.getpaint.net/', color: '#1A9FFF', icon: 'Paintbrush', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 200 },
  { id: 'irfanview', name: 'IrfanView', vendor: 'Irfan Skiljan', category: 'imaging', description: 'Tiny, fast image viewer with batch conversion and plugins.', wingetId: 'IrfanSkiljan.IrfanView', website: 'https://www.irfanview.com/', color: '#2E8B57', icon: 'Image', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 40 },
  { id: 'inkscape', name: 'Inkscape', vendor: 'Inkscape', category: 'imaging', description: 'Professional open-source vector graphics editor (SVG).', wingetId: 'Inkscape.Inkscape', website: 'https://inkscape.org/', color: '#0E5A2B', icon: 'PenTool', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 400 },
  { id: 'blender', name: 'Blender', vendor: 'Blender Foundation', category: 'imaging', description: 'Full 3D creation suite: modeling, animation, VFX, and rendering.', wingetId: 'BlenderFoundation.Blender', website: 'https://www.blender.org/', color: '#E87D0D', icon: 'Box', minRamGB: 8, recommendedRamGB: 16, minCores: 4, minDiskMB: 1200, notes: 'OpenGL 4.3 GPU required. 16 GB RAM recommended for serious scenes.', popular: true },
  { id: 'sharex', name: 'ShareX', vendor: 'ShareX', category: 'imaging', description: 'Screenshot, screen recording, OCR, and sharing toolkit.', wingetId: 'ShareX.ShareX', website: 'https://getsharex.com/', color: '#2881C7', icon: 'Camera', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 120, popular: true },
  { id: 'greenshot', name: 'Greenshot', vendor: 'Greenshot', category: 'imaging', description: 'Lightweight screenshot tool with a built-in editor.', wingetId: 'Greenshot.Greenshot', website: 'https://getgreenshot.org/', color: '#5B9A2A', icon: 'Camera', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 40 },
  { id: 'krita', name: 'Krita', vendor: 'KDE', category: 'imaging', description: 'Open-source digital painting studio for illustration and comics.', wingetId: 'KDE.Krita', website: 'https://krita.org/', color: '#3E8AF0', icon: 'Paintbrush', minRamGB: 4, recommendedRamGB: 8, minCores: 2, minDiskMB: 800, notes: 'A drawing tablet is optional but recommended.' },

  // Documents
  { id: 'libreoffice', name: 'LibreOffice', vendor: 'The Document Foundation', category: 'documents', description: 'Full free office suite: Writer, Calc, Impress, Draw, and Base.', wingetId: 'TheDocumentFoundation.LibreOffice', website: 'https://www.libreoffice.org/', color: '#18A303', icon: 'FileText', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 800, popular: true },
  { id: 'acrobat', name: 'Adobe Acrobat Reader', vendor: 'Adobe', category: 'documents', description: 'Official PDF reader from Adobe for forms, comments, and signatures.', wingetId: 'Adobe.Acrobat.Reader.64-bit', website: 'https://get.adobe.com/reader/', color: '#EC1C24', icon: 'FileText', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 500, popular: true },
  { id: 'foxit', name: 'Foxit PDF Reader', vendor: 'Foxit', category: 'documents', description: 'Fast PDF reader with annotation and ConnectedPDF features.', wingetId: 'Foxit.FoxitReader', website: 'https://www.foxit.com/pdf-reader/', color: '#D70014', icon: 'FileText', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 400 },
  { id: 'sumatra', name: 'Sumatra PDF', vendor: 'Krzysztof Kowalczyk', category: 'documents', description: 'Tiny, open-source reader for PDF, EPUB, MOBI, and comic books.', wingetId: 'SumatraPDF.SumatraPDF', website: 'https://www.sumatrapdfreader.org/', color: '#F7931E', icon: 'BookOpen', minRamGB: 1, recommendedRamGB: 1, minCores: 1, minDiskMB: 20 },
  { id: 'notion', name: 'Notion', vendor: 'Notion Labs', category: 'documents', description: 'All-in-one notes, docs, wikis, and project databases.', wingetId: 'Notion.Notion', website: 'https://www.notion.com/', color: '#000000', icon: 'Notebook', minRamGB: 4, recommendedRamGB: 8, minCores: 2, minDiskMB: 400 },
  { id: 'obsidian', name: 'Obsidian', vendor: 'Obsidian', category: 'documents', description: 'Local-first markdown knowledge base with bidirectional links.', wingetId: 'Obsidian.Obsidian', website: 'https://obsidian.md/', color: '#7C3AED', icon: 'Network', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 250, popular: true },
  { id: 'openoffice', name: 'Apache OpenOffice', vendor: 'Apache', category: 'documents', description: 'Classic free office suite for word processing, sheets, and slides.', wingetId: 'Apache.OpenOffice', website: 'https://www.openoffice.org/', color: '#0E6EB8', icon: 'FileText', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 700 },

  // Security
  { id: 'malwarebytes', name: 'Malwarebytes', vendor: 'Malwarebytes', category: 'security', description: 'Malware scanner and extra layer of protection alongside Windows Security.', wingetId: 'Malwarebytes.Malwarebytes', website: 'https://www.malwarebytes.com/', color: '#004C97', icon: 'Shield', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 300, popular: true },
  { id: 'bitwarden', name: 'Bitwarden', vendor: 'Bitwarden', category: 'security', description: 'Open-source password manager with free cloud sync.', wingetId: 'Bitwarden.Bitwarden', website: 'https://bitwarden.com/', color: '#175DDC', icon: 'KeyRound', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 150, popular: true },
  { id: 'keepass', name: 'KeePass', vendor: 'Dominik Reichl', category: 'security', description: 'Offline, open-source password database stored in a local encrypted file.', wingetId: 'DominikReichl.KeePass', website: 'https://keepass.info/', color: '#6B8E23', icon: 'KeyRound', minRamGB: 1, recommendedRamGB: 1, minCores: 1, minDiskMB: 20 },
  { id: 'keepassxc', name: 'KeePassXC', vendor: 'KeePassXC Team', category: 'security', description: 'Modern cross-platform KeePass client with browser integration.', wingetId: 'KeePassXCTeam.KeePassXC', website: 'https://keepassxc.org/', color: '#6BC441', icon: 'KeyRound', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 40 },
  { id: 'onepassword', name: '1Password', vendor: 'AgileBits', category: 'security', description: 'Polished password manager with Watchtower and passkeys.', wingetId: 'AgileBits.1Password', website: 'https://1password.com/', color: '#1A73E8', icon: 'Lock', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 250 },
  { id: 'protonvpn', name: 'Proton VPN', vendor: 'Proton', category: 'security', description: 'VPN from the Proton Mail team with a generous free tier.', wingetId: 'Proton.ProtonVPN', website: 'https://protonvpn.com/', color: '#6D4AFF', icon: 'GlobeLock', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 250 },
  { id: 'nordvpn', name: 'NordVPN', vendor: 'Nord Security', category: 'security', description: 'Commercial VPN with Threat Protection and Meshnet.', wingetId: 'NordVPN.NordVPN', website: 'https://nordvpn.com/', color: '#4687FF', icon: 'GlobeLock', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 300 },

  // Cloud & sharing
  { id: 'dropbox', name: 'Dropbox', vendor: 'Dropbox', category: 'cloud', description: 'Cloud file sync with selective sync and sharing links.', wingetId: 'Dropbox.Dropbox', website: 'https://www.dropbox.com/', color: '#0061FF', icon: 'Cloud', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 400 },
  { id: 'gdrive', name: 'Google Drive', vendor: 'Google', category: 'cloud', description: 'Official Google Drive for desktop with streaming and mirroring.', wingetId: 'Google.GoogleDrive', website: 'https://www.google.com/drive/download/', color: '#1FA463', icon: 'Cloud', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 400, popular: true },
  { id: 'megasync', name: 'MEGA', vendor: 'Mega', category: 'cloud', description: 'Zero-knowledge encrypted cloud storage desktop client.', wingetId: 'Mega.MEGASync', website: 'https://mega.io/desktop', color: '#D9272E', icon: 'Cloud', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 250 },
  { id: 'qbittorrent', name: 'qBittorrent', vendor: 'qBittorrent', category: 'cloud', description: 'Open-source BitTorrent client with a µTorrent-like interface, no ads.', wingetId: 'qBittorrent.qBittorrent', website: 'https://www.qbittorrent.org/', color: '#2F67A8', icon: 'ArrowDownToLine', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 80, popular: true },
  { id: 'winscp', name: 'WinSCP', vendor: 'Martin Prikryl', category: 'cloud', description: 'SFTP, SCP, and FTP client with a dual-pane commander UI.', wingetId: 'WinSCP.WinSCP', website: 'https://winscp.net/', color: '#1A7BB8', icon: 'FolderSync', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 40 },
  { id: 'filezilla', name: 'FileZilla', vendor: 'Tim Kosse', category: 'cloud', description: 'Popular free FTP and FTPS client. SoftInst pulls the official winget build.', wingetId: 'TimKosse.FileZilla.Client', website: 'https://filezilla-project.org/', color: '#BB0000', icon: 'FolderSync', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 40 },
  { id: 'anydesk', name: 'AnyDesk', vendor: 'AnyDesk', category: 'cloud', description: 'Fast remote desktop for support and accessing your own PC.', wingetId: 'AnyDesk.AnyDesk', website: 'https://anydesk.com/', color: '#EF443B', icon: 'Monitor', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 50 },
  { id: 'teamviewer', name: 'TeamViewer', vendor: 'TeamViewer', category: 'cloud', description: 'Remote access and support platform used worldwide.', wingetId: 'TeamViewer.TeamViewer', website: 'https://www.teamviewer.com/', color: '#0E8BF1', icon: 'Monitor', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 200 },

  // Utilities
  { id: '7zip', name: '7-Zip', vendor: 'Igor Pavlov', category: 'utilities', description: 'Free archiver for 7z, ZIP, RAR, ISO, and dozens of other formats.', wingetId: '7zip.7zip', website: 'https://www.7-zip.org/', color: '#1F4E79', icon: 'Archive', minRamGB: 1, recommendedRamGB: 1, minCores: 1, minDiskMB: 10, popular: true },
  { id: 'winrar', name: 'WinRAR', vendor: 'RARLab', category: 'utilities', description: 'Classic RAR and ZIP archiver with a trial license for personal use.', wingetId: 'RARLab.WinRAR', website: 'https://www.win-rar.com/', color: '#D32F2F', icon: 'Archive', minRamGB: 1, recommendedRamGB: 1, minCores: 1, minDiskMB: 20 },
  { id: 'notepadpp', name: 'Notepad++', vendor: 'Don Ho', category: 'utilities', description: 'Fast Windows code and text editor with syntax highlighting.', wingetId: 'Notepad++.Notepad++', website: 'https://notepad-plus-plus.org/', color: '#90C03F', icon: 'FileCode', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 20, popular: true },
  { id: 'ccleaner', name: 'CCleaner', vendor: 'Piriform', category: 'utilities', description: 'Temp-file cleaner and startup manager. Use the official winget package.', wingetId: 'Piriform.CCleaner', website: 'https://www.ccleaner.com/', color: '#C03A2B', icon: 'Sparkles', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 50 },
  { id: 'everything', name: 'Everything', vendor: 'voidtools', category: 'utilities', description: 'Instant filename search across entire NTFS volumes.', wingetId: 'voidtools.Everything', website: 'https://www.voidtools.com/', color: '#3D7A3D', icon: 'Search', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 20, popular: true },
  { id: 'powertoys', name: 'PowerToys', vendor: 'Microsoft', category: 'utilities', description: 'FancyZones, Peek, PowerRename, Awake, and other Windows superpowers.', wingetId: 'Microsoft.PowerToys', website: 'https://learn.microsoft.com/windows/powertoys/', color: '#F2C811', icon: 'Zap', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 250, popular: true },
  { id: 'cpuz', name: 'CPU-Z', vendor: 'CPUID', category: 'utilities', description: 'Reads CPU, motherboard, memory, and SPD details.', wingetId: 'CPUID.CPU-Z', website: 'https://www.cpuid.com/softwares/cpu-z.html', color: '#F28C28', icon: 'Cpu', minRamGB: 1, recommendedRamGB: 1, minCores: 1, minDiskMB: 10 },
  { id: 'hwmonitor', name: 'HWMonitor', vendor: 'CPUID', category: 'utilities', description: 'Hardware sensor monitor for temperatures, voltages, and fans.', wingetId: 'CPUID.HWMonitor', website: 'https://www.cpuid.com/softwares/hwmonitor.html', color: '#E85D04', icon: 'Thermometer', minRamGB: 1, recommendedRamGB: 1, minCores: 1, minDiskMB: 10 },
  { id: 'windirstat', name: 'WinDirStat', vendor: 'WinDirStat', category: 'utilities', description: 'Treemap disk-usage visualizer so you can find what is eating space.', wingetId: 'WinDirStat.WinDirStat', website: 'https://windirstat.net/', color: '#3B82C4', icon: 'PieChart', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 10 },
  { id: 'wiztree', name: 'WizTree', vendor: 'Antibody Software', category: 'utilities', description: 'Extremely fast NTFS disk space analyzer.', wingetId: 'AntibodySoftware.WizTree', website: 'https://www.diskanalyzer.com/', color: '#5B9BD5', icon: 'PieChart', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 10 },
  { id: 'putty', name: 'PuTTY', vendor: 'Simon Tatham', category: 'utilities', description: 'SSH, Telnet, and serial terminal for Windows.', wingetId: 'PuTTY.PuTTY', website: 'https://www.putty.org/', color: '#2B2B2B', icon: 'Terminal', minRamGB: 1, recommendedRamGB: 1, minCores: 1, minDiskMB: 10 },
  { id: 'revo', name: 'Revo Uninstaller', vendor: 'VS Revo Group', category: 'utilities', description: 'Uninstaller that hunts leftover files and registry keys.', wingetId: 'RevoUninstaller.RevoUninstaller', website: 'https://www.revouninstaller.com/', color: '#E53935', icon: 'Trash2', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 40 },

  // Developer
  { id: 'vscode', name: 'Visual Studio Code', vendor: 'Microsoft', category: 'developer', description: 'The most popular free code editor, with a massive extension marketplace.', wingetId: 'Microsoft.VisualStudioCode', website: 'https://code.visualstudio.com/', color: '#007ACC', icon: 'Code', minRamGB: 2, recommendedRamGB: 8, minCores: 2, minDiskMB: 400, popular: true },
  { id: 'git', name: 'Git', vendor: 'Git', category: 'developer', description: 'Distributed version control. SoftInst installs Git for Windows.', wingetId: 'Git.Git', website: 'https://git-scm.com/', color: '#F05032', icon: 'GitBranch', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 300, popular: true },
  { id: 'python', name: 'Python 3.12', vendor: 'Python Software Foundation', category: 'developer', description: 'Official CPython 3.12 for Windows from winget.', wingetId: 'Python.Python.3.12', website: 'https://www.python.org/', color: '#3776AB', icon: 'Code', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 200, popular: true },
  { id: 'nodejs', name: 'Node.js LTS', vendor: 'OpenJS Foundation', category: 'developer', description: 'Long-term support Node.js runtime plus npm.', wingetId: 'OpenJS.NodeJS.LTS', website: 'https://nodejs.org/', color: '#339933', icon: 'Hexagon', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 200, popular: true },
  { id: 'githubdesktop', name: 'GitHub Desktop', vendor: 'GitHub', category: 'developer', description: 'Visual Git client for cloning, branching, and pull requests.', wingetId: 'GitHub.GitHubDesktop', website: 'https://desktop.github.com/', color: '#24292F', icon: 'GitBranch', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 250 },
  { id: 'docker', name: 'Docker Desktop', vendor: 'Docker', category: 'developer', description: 'Containers, Compose, and Kubernetes on Windows via WSL 2.', wingetId: 'Docker.DockerDesktop', website: 'https://www.docker.com/products/docker-desktop/', color: '#2496ED', icon: 'Box', minRamGB: 8, recommendedRamGB: 16, minCores: 4, minDiskMB: 4000, notes: 'Needs virtualization (WSL 2) enabled in BIOS/Windows Features.', popular: true },
  { id: 'terminal', name: 'Windows Terminal', vendor: 'Microsoft', category: 'developer', description: 'Modern GPU-accelerated terminal for PowerShell, CMD, and WSL.', wingetId: 'Microsoft.WindowsTerminal', website: 'https://aka.ms/terminal', color: '#512BD4', icon: 'Terminal', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 150 },
  { id: 'postman', name: 'Postman', vendor: 'Postman', category: 'developer', description: 'API platform for designing, testing, and documenting HTTP APIs.', wingetId: 'Postman.Postman', website: 'https://www.postman.com/', color: '#FF6C37', icon: 'Send', minRamGB: 4, recommendedRamGB: 8, minCores: 2, minDiskMB: 500 },
  { id: 'sublime', name: 'Sublime Text 4', vendor: 'Sublime HQ', category: 'developer', description: 'Blazing-fast proprietary text editor with a free evaluation.', wingetId: 'SublimeHQ.SublimeText.4', website: 'https://www.sublimetext.com/', color: '#FF9800', icon: 'FileCode', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 50 },
  { id: 'jetbrains', name: 'JetBrains Toolbox', vendor: 'JetBrains', category: 'developer', description: 'Installer and updater for IntelliJ, PyCharm, WebStorm, and friends.', wingetId: 'JetBrains.Toolbox', website: 'https://www.jetbrains.com/toolbox-app/', color: '#000000', icon: 'Box', minRamGB: 4, recommendedRamGB: 8, minCores: 2, minDiskMB: 300 },
  { id: 'vs2022', name: 'Visual Studio 2022 Community', vendor: 'Microsoft', category: 'developer', description: 'Full IDE for .NET, C++, and more. Community edition is free.', wingetId: 'Microsoft.VisualStudio.2022.Community', website: 'https://visualstudio.microsoft.com/', color: '#5C2D91', icon: 'Code', minRamGB: 8, recommendedRamGB: 16, minCores: 4, minDiskMB: 10000, notes: 'Workload download can need 10–50 GB depending on what you pick in the installer.' },
  { id: 'dbeaver', name: 'DBeaver Community', vendor: 'DBeaver', category: 'developer', description: 'Universal database GUI for SQL, NoSQL, and cloud engines.', wingetId: 'DBeaver.DBeaver.Community', website: 'https://dbeaver.io/', color: '#F5A623', icon: 'Database', minRamGB: 4, recommendedRamGB: 8, minCores: 2, minDiskMB: 300 },

  // Runtimes
  { id: 'temurin17', name: 'Eclipse Temurin 17 JRE', vendor: 'Adoptium', category: 'runtimes', description: 'OpenJDK 17 Java runtime from the Eclipse Adoptium project.', wingetId: 'EclipseAdoptium.Temurin.17.JRE', website: 'https://adoptium.net/', color: '#FF6B00', icon: 'Coffee', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 150, popular: true },
  { id: 'dotnet8', name: '.NET 8 Desktop Runtime', vendor: 'Microsoft', category: 'runtimes', description: 'Required by many modern Windows desktop apps built on WPF/WinForms.', wingetId: 'Microsoft.DotNet.DesktopRuntime.8', website: 'https://dotnet.microsoft.com/download', color: '#512BD4', icon: 'Cpu', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 200, popular: true },
  { id: 'vcredist', name: 'Visual C++ Redistributable', vendor: 'Microsoft', category: 'runtimes', description: '2015–2022 x64 runtime used by a huge number of native Windows apps.', wingetId: 'Microsoft.VCRedist.2015+.x64', website: 'https://learn.microsoft.com/cpp/windows/latest-supported-vc-redist', color: '#5C2D91', icon: 'Cpu', minRamGB: 1, recommendedRamGB: 1, minCores: 1, minDiskMB: 40, popular: true },
  { id: 'dotnetdesktop9', name: '.NET 9 Desktop Runtime', vendor: 'Microsoft', category: 'runtimes', description: 'Latest .NET desktop runtime for apps targeting .NET 9.', wingetId: 'Microsoft.DotNet.DesktopRuntime.9', website: 'https://dotnet.microsoft.com/download', color: '#7B61FF', icon: 'Cpu', minRamGB: 1, recommendedRamGB: 2, minCores: 1, minDiskMB: 200 },

  // Gaming
  { id: 'steam', name: 'Steam', vendor: 'Valve', category: 'gaming', description: 'Valve’s store, library, and overlay for PC games.', wingetId: 'Valve.Steam', website: 'https://store.steampowered.com/about/', color: '#1B2838', icon: 'Gamepad2', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 400, popular: true },
  { id: 'epic', name: 'Epic Games Launcher', vendor: 'Epic Games', category: 'gaming', description: 'Launcher for Fortnite, the Epic Games Store, and Unreal projects.', wingetId: 'EpicGames.EpicGamesLauncher', website: 'https://store.epicgames.com/', color: '#2A2A2A', icon: 'Gamepad2', minRamGB: 4, recommendedRamGB: 8, minCores: 2, minDiskMB: 500 },
  { id: 'gog', name: 'GOG Galaxy', vendor: 'CD PROJEKT', category: 'gaming', description: 'DRM-free GOG library plus optional connections to other stores.', wingetId: 'GOG.Galaxy', website: 'https://www.gog.com/galaxy', color: '#C046A0', icon: 'Gamepad2', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 400 },
  { id: 'ubisoft', name: 'Ubisoft Connect', vendor: 'Ubisoft', category: 'gaming', description: 'Ubisoft’s game launcher, overlay, and rewards hub.', wingetId: 'Ubisoft.Connect', website: 'https://ubisoftconnect.com/', color: '#0070FF', icon: 'Gamepad2', minRamGB: 2, recommendedRamGB: 4, minCores: 2, minDiskMB: 400 },
  { id: 'ea', name: 'EA App', vendor: 'Electronic Arts', category: 'gaming', description: 'Official EA launcher that replaced Origin.', wingetId: 'ElectronicArts.EADesktop', website: 'https://www.ea.com/ea-app', color: '#FF4747', icon: 'Gamepad2', minRamGB: 4, recommendedRamGB: 8, minCores: 2, minDiskMB: 500 },
]

export const PRESETS: { id: string; name: string; blurb: string; color: string; appIds: string[] }[] = [
  {
    id: 'fresh',
    name: 'Fresh PC',
    blurb: 'Browsers, zip, video, PDF, chat, notes',
    color: '#FF5A5F',
    appIds: ['chrome', 'firefox', '7zip', 'vlc', 'acrobat', 'discord', 'notepadpp', 'powertoys', 'vcredist'],
  },
  {
    id: 'dev',
    name: 'Developer',
    blurb: 'Editor, git, runtimes, terminal, APIs',
    color: '#7B61FF',
    appIds: ['chrome', 'vscode', 'git', 'python', 'nodejs', 'terminal', 'githubdesktop', 'postman', '7zip'],
  },
  {
    id: 'creator',
    name: 'Creator',
    blurb: 'Record, paint, 3D, audio, capture',
    color: '#FF8DC7',
    appIds: ['obs', 'gimp', 'audacity', 'blender', 'sharex', 'vlc', 'handbrake', 'krita'],
  },
  {
    id: 'gamer',
    name: 'Gamer',
    blurb: 'Launchers, Discord, codecs, zip',
    color: '#7DDE92',
    appIds: ['steam', 'discord', 'epic', '7zip', 'chrome', 'obs', 'klite'],
  },
  {
    id: 'office',
    name: 'Office',
    blurb: 'Docs, meetings, PDF, cloud drive',
    color: '#00C2B8',
    appIds: ['chrome', 'libreoffice', 'acrobat', 'zoom', 'teams', 'gdrive', '7zip', 'sumatra'],
  },
]

export function getApp(id: string) {
  return APPS.find((a) => a.id === id)
}

export function appsByCategory(category: CategoryId) {
  return APPS.filter((a) => a.category === category)
}
