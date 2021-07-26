const makePublicPolicy = (bucketName: string) => ({
    Version: '2012-10-17',
    Statement: [
        {
            Action: ['s3:GetObject'],
            Effect: 'Allow',
            Principal: '*',
            Resource: [`arn:aws:s3:::${bucketName}/*`],
            Sid: '',
        },
    ],
});

export const makePublicPolicyStringified = (bucketName: string): string =>
    JSON.stringify(makePublicPolicy(bucketName));
