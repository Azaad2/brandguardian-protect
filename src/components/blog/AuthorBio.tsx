import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react';
import { trackSEOInteraction } from '@/lib/analytics';

interface AuthorBioProps {
  name: string;
  bio: string;
  avatar?: string;
  role?: string;
  expertise?: string[];
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
    website?: string;
  };
  articleCount?: number;
  className?: string;
}

const AuthorBio: React.FC<AuthorBioProps> = ({
  name,
  bio,
  avatar,
  role = "Content Specialist",
  expertise = [],
  social = {},
  articleCount = 0,
  className = ''
}) => {
  const handleSocialClick = (platform: string, url: string) => {
    trackSEOInteraction('Author_Social_Click', platform, name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className={`${className}`} itemScope itemType="https://schema.org/Person">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Author Avatar */}
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            {avatar ? (
              <AvatarImage src={avatar} alt={`${name} profile picture`} itemProp="image" />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground" itemProp="name">
                  {name}
                </h3>
                <p className="text-sm text-muted-foreground" itemProp="jobTitle">
                  {role}
                </p>
              </div>
              
              {/* Social Links */}
              {Object.keys(social).length > 0 && (
                <div className="flex items-center gap-2">
                  {social.linkedin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialClick('LinkedIn', social.linkedin!)}
                      className="w-8 h-8 p-0"
                      aria-label={`${name}'s LinkedIn profile`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  )}
                  {social.twitter && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialClick('Twitter', social.twitter!)}
                      className="w-8 h-8 p-0"
                      aria-label={`${name}'s Twitter profile`}
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                  )}
                  {social.email && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialClick('Email', `mailto:${social.email}`)}
                      className="w-8 h-8 p-0"
                      aria-label={`Email ${name}`}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  )}
                  {social.website && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialClick('Website', social.website!)}
                      className="w-8 h-8 p-0"
                      aria-label={`${name}'s website`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Author Bio */}
            <p className="text-muted-foreground text-sm mb-3" itemProp="description">
              {bio}
            </p>

            {/* Expertise Tags */}
            {expertise.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Expertise:</p>
                <div className="flex flex-wrap gap-1">
                  {expertise.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Article Count */}
            {articleCount > 0 && (
              <div className="text-xs text-muted-foreground">
                {articleCount} article{articleCount !== 1 ? 's' : ''} published
              </div>
            )}
          </div>
        </div>

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@type": "Person",
            "name": name,
            "jobTitle": role,
            "description": bio,
            ...(avatar && { "image": avatar }),
            ...(social.linkedin && { "sameAs": [social.linkedin] }),
            "worksFor": {
              "@type": "Organization",
              "name": "BndBox"
            }
          })}
        </script>
      </CardContent>
    </Card>
  );
};

export default AuthorBio;