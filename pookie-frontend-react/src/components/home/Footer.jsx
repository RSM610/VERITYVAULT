import { styled, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";

import fbIcon from "../../img/fbicon.png";
import twitterIcon from "../../img/twittericon.png";
import linkedinIcon from "../../img/linkedinicon.png";

const Footer = () => {
    const CustomContainer = styled(Container)(({ theme }) => ({
        display: "flex",
        justifyContent: "center",
        gap: theme.spacing(5),
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
            textAlign: "center",
        },
    }));

    const IconBox = styled(Box)(({ theme }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        [theme.breakpoints.down("sm")]: {
            justifyContent: "center",
        },
    }));

    const FooterLink = styled("span")(({ theme }) => ({
        fontSize: "18px",
        color: "#000",
        fontWeight: "300",
        cursor: "pointer",
        "&:hover": {
            color: "#333",
        },
    }));

    return (
        <Box sx={{ py: 10, backgroundColor: "#4682B4" }}>
            <CustomContainer>
                <Box>
                    <Typography
                        sx={{
                            fontSize: "24px",
                            color: "#000",
                            fontWeight: "700",
                            mb: 2,
                            textAlign: "center",
                        }}
                    >
                        Get in touch
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "18px",
                            color: "#000",
                            fontWeight: "500",
                            mb: 2,
                            textAlign: "center",
                        }}
                    >
                        Let us help you find the perfect solution for your needs.
                    </Typography>

                    <IconBox>
                        <a
                            href="https://www.facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                        >
                            <img
                                src={fbIcon}
                                alt="fbIcon"
                                style={{
                                    cursor: "pointer",
                                    width: "32px",
                                    height: "32px",
                                    filter: "grayscale(100%)",
                                }}
                            />
                        </a>
                        <a
                            href="https://www.x.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                        >
                            <img
                                src={twitterIcon}
                                alt="twitterIcon"
                                style={{
                                    cursor: "pointer",
                                    width: "32px",
                                    height: "32px",
                                    filter: "grayscale(100%)",
                                }}
                            />
                        </a>
                        <a
                            href="https://www.linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                        >
                            <img
                                src={linkedinIcon}
                                alt="linkedinIcon"
                                style={{
                                    cursor: "pointer",
                                    width: "32px",
                                    height: "32px",
                                    filter: "grayscale(100%)",
                                }}
                            />
                        </a>
                    </IconBox>
                </Box>
            </CustomContainer>
        </Box>
    );
};

export default Footer;