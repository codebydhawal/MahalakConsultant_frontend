import React, { useEffect, useState } from "react";
import { SiteConfig } from "../types";
import TeamService from "../services/TeamService";
import { TeamResponse } from "../services/Team";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Avatar,
  Box,
  Divider,
} from "@mui/material";

export const About: React.FC<{
  config: SiteConfig
}> = ({ config }) => {
  const [teamMembers, setTeamMembers] = useState<TeamResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedTeam, setSelectedTeam] =
    useState<TeamResponse | null>(null);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {

    try {

      setLoading(true);

      const response = await TeamService.getAllTeams();
      const teamsData = response.data.data;

      setTeams(teamsData);
      setSelectedImage(teamsData[0]?.profileImageUrl);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="animate-in fade-in duration-700">
      <section className="relative h-[50vh] bg-stone-900 flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">Our Mission.</h1>
          <p className="text-stone-400 text-lg font-light tracking-[0.2em] uppercase">Designing with purpose</p>
        </div>
      </section>

      {/* <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-8">{config.aboutTitle}</h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto mb-10" style={{ backgroundColor: config.accentColor }}></div>
          </div>
          <div className="rich-text-content text-stone-600 leading-relaxed text-lg text-center" dangerouslySetInnerHTML={{ __html: config.aboutDescription }}></div>
        </div>
      </section> */}

      <section className="py-24 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-8">{config.aboutTitle}</h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto mb-10" style={{ backgroundColor: config.accentColor }}></div>
            <div className="rich-text-content text-stone-600 leading-relaxed text-lg text-center" dangerouslySetInnerHTML={{ __html: config.aboutDescription }}></div>
          </div>
          <Divider sx={{ borderColor: config.accentColor, mb: 8 }} />
          <div className="text-center mb-20">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700 mb-6" style={{ color: config.accentColor }}>Core Team</h2>
            <h3 className="text-4xl font-bold">The Visionaries</h3>
          </div>

          <Grid container spacing={4} sx={{ justifyContent: "center" }}>
            {teams.map((member) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={member.teamId}>
                <Card
                  onClick={() => setSelectedTeam(member)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 4,
                    height: "100%",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      pt: 4,
                    }}
                  >
                    <Avatar
                      src={member.profileImageUrl}
                      alt={member.fullName}
                      sx={{
                        width: 130,
                        height: 130,
                      }}
                    />
                  </Box>

                  <CardContent>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold" }}
                      gutterBottom
                    >
                      {member.fullName}
                    </Typography>

                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: config.accentColor,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        mb: 2,
                      }}
                    >
                      {member.designation}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {member.shortBio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {selectedTeam && (

            <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">

              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in duration-300">

                {/* Close */}

                <button
                  onClick={() => setSelectedTeam(null)}
                  className="absolute top-5 right-5 text-gray-500 hover:text-red-500 text-2xl"
                >
                  ✕
                </button>

                <div className="p-8">

                  {/* Profile */}

                  <div className="flex justify-center">

                    {selectedTeam.profileImageUrl ? (

                      <img
                        src={selectedTeam.profileImageUrl}
                        className="w-32 h-32 rounded-full object-cover border-4 border-amber-500"
                      />

                    ) : (

                      <div className="w-32 h-32 rounded-full bg-amber-600 text-white flex items-center justify-center text-5xl font-bold">

                        {selectedTeam.fullName.charAt(0)}

                      </div>

                    )}

                  </div>

                  <h2 className="text-2xl font-bold text-center mt-5">

                    {selectedTeam.fullName}

                  </h2>

                  <p className="text-center text-gray-500">

                    {selectedTeam.designation}

                  </p>

                  <div className="mt-8 space-y-4">

                    <div className="flex justify-between border-b pb-2">

                      <span className="font-semibold">
                        Email
                      </span>

                      <span>
                        {selectedTeam.email}
                      </span>

                    </div>

                    <div className="flex justify-between border-b pb-2">

                      <span className="font-semibold">
                        Phone
                      </span>

                      <span>
                        {selectedTeam.phoneNumber}
                      </span>

                    </div>

                    <div className="flex justify-between border-b pb-2">

                      <span className="font-semibold">
                        Display Order
                      </span>

                      <span>
                        {selectedTeam.displayOrder}
                      </span>

                    </div>

                    <div>

                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 1 }}
                      >
                        Bio
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {selectedTeam.shortBio}
                      </Typography>

                    </div>

                    <div className="pt-4 flex flex-wrap gap-3">

                      {selectedTeam.linkedInUrl && (

                        <a
                          href={selectedTeam.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:underline"
                        >
                          LinkedIn
                        </a>

                      )}

                      {selectedTeam.instagramUrl && (

                        <a
                          href={selectedTeam.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:underline"
                        >
                          Instagram
                        </a>

                      )}

                      {selectedTeam.facebookUrl && (

                        <a
                          href={selectedTeam.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Facebook
                        </a>

                      )}

                      {selectedTeam.twitterUrl && (

                        <a
                          href={selectedTeam.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-500 hover:underline"
                        >
                          Twitter
                        </a>

                      )}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          )}
        </div>
      </section>
    </div>
  );
};
