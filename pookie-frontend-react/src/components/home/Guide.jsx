import { Box, Button, styled, Typography } from "@mui/material";
import React from "react";

import CustomButton from "./CustomButton";

const Guide = () => {
    const CustomBox = styled(Box)(({ theme }) => ({
        width: "30%",
        [theme.breakpoints.down("md")]: {
            width: "85%",
        },
    }));

    const GuidesBox = styled(Box)(({ theme }) => ({
        display: "flex",
        justifyContent: "space-around",
        width: "70%",
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
        [theme.breakpoints.down("md")]: {
            width: "100%",
        },
        [theme.breakpoints.down("sm")]: {
            marginBottom: "0",
            flexDirection: "column",
        },
    }));

    const GuideBox = styled(Box)(({ theme }) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: theme.spacing(5),
        [theme.breakpoints.down("sm")]: {
            margin: theme.spacing(2, 0, 2, 0),
        },
    }));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "5rem",
            }}
        >
            <div
                style={{
                    width: "5%",
                    height: "5px",
                    backgroundColor: "#000339",
                    margin: "0 auto",
                }}
            ></div>

            <Typography
                variant="h3"
                sx={{ fontSize: "35px", fontWeight: "bold", color: "#000339", my: 3 }}
            >
                How it works?
            </Typography>

            <CustomBox>
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#5A6473",
                        textAlign: "center",
                        marginBottom: "2rem",
                    }}
                >
                    Our VerityVault document verification system using blockchain technology assigns a unique digital ID to each document, recorded on the blockchain. Users can scan a document's QR code or enter its digital ID on our platform to verify its authenticity and ensure it has not been altered or forged. By leveraging the security and transparency of the blockchain, our system provides a reliable and efficient way to combat document fraud and protect users' trust and confidence.
                </Typography>
            </CustomBox>

            <a href="pookie-frontend-react/src/User%20Manual.pdf" style={{ textDecoration: "none" }}>
                <CustomButton
                    backgroundColor="#0F1B4C"
                    color="#fff"
                    buttonText="See Full Guides"
                    guideBtn={true}
                />
            </a>
        </Box>
    );
};

export default Guide;