import { styled, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";

import fbIcon from "../../img/fbicon.png";
import twitterIcon from "../../img/twittericon.png";
import linkedinIcon from "../../img/linkedinicon.png";

const Footer = () => {
    const CustomContainer = styled(Container)(({ theme }) => ({
        display: "flex",
        justifyContent: "center", // Center content horizontally
        gap: theme.spacing(5),
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
            textAlign: "center",
        },
    }));

    const IconBox = styled(Box)(({ theme }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // Center icons horizontally
        gap: "1.5rem", // Slightly larger gap for bigger icons
        [theme.breakpoints.down("sm")]: {
            justifyContent: "center",
        },
    }));

    const FooterLink = styled("span")(({ theme }) => ({
        fontSize: "18px", // Slightly larger font size
        color: "#000", // Black color
        fontWeight: "300",
        cursor: "pointer",
        "&:hover": {
            color: "#333", // Slightly lighter black on hover
        },
    }));

    return (
        <Box sx={{ py: 10, backgroundColor: "#4682B4" }}>
            <CustomContainer>
                <Box>
                    <Typography
                        sx={{
                            fontSize: "24px", // Larger font size
                            color: "#000", // Black color
                            fontWeight: "700",
                            mb: 2,
                            textAlign: "center", // Center text
                        }}
                    >
                        Get in touch
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "18px", // Larger font size
                            color: "#000", // Black color
                            fontWeight: "500",
                            mb: 2,
                            textAlign: "center", // Center text
                        }}
                    >
                        Let us help you find the perfect solution for your needs.
                    </Typography>

                    <IconBox>
                        <img
                            src={fbIcon}
                            alt="fbIcon"
                            style={{
                                cursor: "pointer",
                                width: "32px", // Larger icon size
                                height: "32px",
                                filter: "grayscale(100%)", // Make icon black
                            }}
                        />
                        <img
                            src={twitterIcon}
                            alt="twitterIcon"
                            style={{
                                cursor: "pointer",
                                width: "32px", // Larger icon size
                                height: "32px",
                                filter: "grayscale(100%)", // Make icon black
                            }}
                        />
                        <img
                            src={linkedinIcon}
                            alt="linkedinIcon"
                            style={{
                                cursor: "pointer",
                                width: "32px", // Larger icon size
                                height: "32px",
                                filter: "grayscale(100%)", // Make icon black
                            }}
                        />
                    </IconBox>
                </Box>
            </CustomContainer>
        </Box>
    );
};

export default Footer;